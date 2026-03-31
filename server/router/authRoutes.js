import express from "express";
import client from "../config/connectdatabase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

const router = express.Router();

const DEFAULT_USER = {
  username: "admin@admin",
  email: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASS,
};

const signToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    },
    process.env.JWT_KEY,
    { expiresIn: "3h" }
  );

const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const { password, reset_token, reset_token_expiry, ...safeUser } = user;
  return safeUser;
};

const verifyToken = (allowedRoles = []) => async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const { rows } = await client.query("SELECT * FROM users WHERE id = $1", [decoded.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const currentUser = rows[0];

    if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

router.post("/register", async (req, res) => {
  let { username, email, password } = req.body;

  username = username || DEFAULT_USER.username;
  email = email || DEFAULT_USER.email;
  password = password || DEFAULT_USER.password;

  try {
    const { rows: existingUser } = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const { rows: newUser } = await client.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashPassword, "admin"]
    );

    res.status(201).json({ message: "User created successfully", user: sanitizeUser(newUser[0]) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;

  email = email || DEFAULT_USER.email;
  password = password || DEFAULT_USER.password;

  try {
    const { rows } = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const user = rows[0];
    if (user.role !== "admin") {
      return res.status(403).json({ message: "This account cannot access the admin panel" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = signToken(user);
    return res.status(200).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/home", verifyToken(["admin"]), async (req, res) => {
  return res.status(200).json({ user: sanitizeUser(req.user) });
});

router.post("/client/register", async (req, res) => {
  const {
    first_name,
    last_name,
    username,
    email,
    password,
    phone = "",
  } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "First name, last name, email, and password are required" });
  }

  try {
    const { rows: existingUser } = await client.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: "Account already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const displayName = username || `${first_name} ${last_name}`.trim();

    const { rows } = await client.query(
      "INSERT INTO users (username, email, password, role, first_name, last_name, phone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [displayName, email, hashPassword, "candidate", first_name, last_name, phone]
    );

    const token = signToken(rows[0]);
    res.status(201).json({ token, user: sanitizeUser(rows[0]), message: "Account created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/client/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const { rows } = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Account does not exist" });
    }

    const user = rows[0];
    if (user.role !== "candidate") {
      return res.status(403).json({ message: "Use the admin login for this account" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = signToken(user);
    res.status(200).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/client/me", verifyToken(["candidate"]), async (req, res) => {
  res.status(200).json({ user: sanitizeUser(req.user) });
});

router.get("/client/applied-jobs", verifyToken(["candidate"]), async (req, res) => {
  try {
    const { rows } = await client.query(
      `SELECT
        c.id AS application_id,
        c.first_name,
        c.last_name,
        c.email,
        c.phone,
        c.linkedin,
        c.website,
        c.resume,
        c.cover,
        c.job_id,
        c.job_title,
        c.applied_at,
        j.job_location,
        j.job_category,
        j.job_type,
        j.job_status,
        j.job_created_by,
        j.job_budget,
        j.job_close_date
      FROM candidates c
      LEFT JOIN jobpost j ON j.job_id = c.job_id
      WHERE c.user_id = $1
      ORDER BY c.applied_at DESC`,
      [req.user.id]
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const { rows: user } = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.length === 0) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 60 * 60 * 1000;

    await client.query(
      "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3",
      [resetToken, resetTokenExpiry, email]
    );

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset",
      text: `Use this link to reset your password:\n\nhttps://jobadmin.ashwinsrivastava.com/reset-password/${resetToken}\n`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error in forgot-password route:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const { rows: user } = await client.query(
      "SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > $2",
      [token, Date.now()]
    );

    if (user.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await client.query(
      "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2",
      [hashPassword, user[0].id]
    );

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
