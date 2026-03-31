import client from "./connectdatabase.js";
import bcrypt from "bcrypt";

const defaultAdminCredentials = {
  username: "admin@admin",
  email: process.env.ADMIN_EMAIL || "admincareer@gmail.com",
  password: process.env.ADMIN_PASSWORD || "admin@career",
};

const seedLocations = ["Bengaluru", "Chennai", "Hyderabad", "Pune", "Remote"];

const seedCategories = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Customer Success",
];

const seedJobs = [
  {
    job_title: "Frontend React Developer",
    job_location_type: ["Hybrid"],
    job_category: "Engineering",
    job_type: ["Full Time"],
    job_location: "Bengaluru",
    job_experience_level: 2,
    job_technical_skills: ["React", "JavaScript", "CSS", "REST API"],
    job_education_qualification: ["B.E", "B.Tech", "B.Sc"],
    job_description:
      "<p>Build polished candidate-facing experiences, collaborate with designers, and ship reusable UI components for our hiring products.</p><ul><li>Own responsive React interfaces</li><li>Integrate backend APIs</li><li>Improve application conversion journeys</li></ul>",
    job_interview_rounds: "3 rounds",
    job_budget: "8 LPA",
    job_create_date: "2026-03-31",
    job_close_date: "2026-12-31",
    job_status: "Active",
    job_created_by: "Nova Hiring",
  },
  {
    job_title: "Node.js Backend Engineer",
    job_location_type: ["Remote"],
    job_category: "Engineering",
    job_type: ["Full Time"],
    job_location: "Remote",
    job_experience_level: 3,
    job_technical_skills: ["Node.js", "Express", "PostgreSQL", "API Design"],
    job_education_qualification: ["B.E", "B.Tech", "MCA"],
    job_description:
      "<p>Design reliable APIs for careers, applications, and recruiter workflows.</p><ul><li>Create scalable services</li><li>Model hiring data</li><li>Support deployment-ready features</li></ul>",
    job_interview_rounds: "4 rounds",
    job_budget: "12 LPA",
    job_create_date: "2026-03-31",
    job_close_date: "2026-12-31",
    job_status: "Active",
    job_created_by: "Talent Grid",
  },
  {
    job_title: "Product Designer",
    job_location_type: ["On Site"],
    job_category: "Design",
    job_type: ["Full Time"],
    job_location: "Chennai",
    job_experience_level: 2,
    job_technical_skills: ["Figma", "Wireframing", "Prototyping", "Design Systems"],
    job_education_qualification: ["Any Degree"],
    job_description:
      "<p>Create intuitive flows for job seekers and recruiters.</p><ul><li>Design search-first experiences</li><li>Build accessible UI patterns</li><li>Work closely with product and engineering</li></ul>",
    job_interview_rounds: "3 rounds",
    job_budget: "9 LPA",
    job_create_date: "2026-03-31",
    job_close_date: "2026-12-31",
    job_status: "Active",
    job_created_by: "Bright Careers",
  },
];

const ensureTables = async () => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS location (
      location_id SERIAL PRIMARY KEY,
      location_title VARCHAR(225) NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS category (
      category_id SERIAL PRIMARY KEY,
      category_title VARCHAR(225) NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(225) NOT NULL,
      email VARCHAR(225) NOT NULL UNIQUE,
      password VARCHAR(225) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS jobpost (
      job_id SERIAL PRIMARY KEY,
      job_title VARCHAR(225) NOT NULL,
      job_location_type TEXT[] NOT NULL,
      job_category VARCHAR(225) NOT NULL,
      job_type TEXT[] NOT NULL,
      job_location VARCHAR(225) NOT NULL,
      job_experience_level INTEGER NOT NULL,
      job_technical_skills TEXT[] NOT NULL,
      job_education_qualification TEXT[] NOT NULL,
      job_description TEXT NOT NULL,
      job_interview_rounds VARCHAR(225) NOT NULL,
      job_budget VARCHAR(225) NOT NULL,
      job_create_date VARCHAR(225) NOT NULL,
      job_close_date VARCHAR(225) NOT NULL,
      job_status VARCHAR(225) NOT NULL,
      job_created_by VARCHAR(225)
    );

    CREATE TABLE IF NOT EXISTS candidates (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(225) NOT NULL,
      last_name VARCHAR(225) NOT NULL,
      email VARCHAR(225) NOT NULL,
      phone VARCHAR(225) NOT NULL,
      linkedin VARCHAR(225) NOT NULL,
      website VARCHAR(225) NOT NULL,
      resume TEXT NOT NULL,
      cover TEXT NOT NULL,
      job_id INTEGER NOT NULL,
      job_title VARCHAR(225) NOT NULL
    );
  `);

  await client.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'candidate',
    ADD COLUMN IF NOT EXISTS first_name VARCHAR(225),
    ADD COLUMN IF NOT EXISTS last_name VARCHAR(225),
    ADD COLUMN IF NOT EXISTS phone VARCHAR(225),
    ADD COLUMN IF NOT EXISTS reset_token TEXT,
    ADD COLUMN IF NOT EXISTS reset_token_expiry BIGINT;

    ALTER TABLE candidates
    ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
  `);
};

const ensureDefaultAdmin = async () => {
  const defaultEmail = defaultAdminCredentials.email;
  const defaultPassword = defaultAdminCredentials.password;

  if (!defaultEmail || !defaultPassword) {
    return;
  }

  const { rows } = await client.query(
    "SELECT id, email FROM users WHERE role = 'admin' ORDER BY id ASC LIMIT 1"
  );

  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  if (rows.length > 0) {
    await client.query(
      "UPDATE users SET username = $1, email = $2, password = $3, role = 'admin' WHERE id = $4",
      [defaultAdminCredentials.username, defaultEmail, hashedPassword, rows[0].id]
    );
    return;
  }

  await client.query(
    "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
    [defaultAdminCredentials.username, defaultEmail, hashedPassword, "admin"]
  );
};

const seedLookupTable = async (tableName, columnName, values) => {
  const { rows } = await client.query(`SELECT COUNT(*)::int AS count FROM ${tableName}`);
  if (rows[0].count > 0) {
    return;
  }

  for (const value of values) {
    await client.query(
      `INSERT INTO ${tableName} (${columnName}) VALUES ($1) ON CONFLICT (${columnName}) DO NOTHING`,
      [value]
    );
  }
};

const seedDefaultJobs = async () => {
  const { rows } = await client.query("SELECT COUNT(*)::int AS count FROM jobpost");
  if (rows[0].count > 0) {
    return;
  }

  for (const job of seedJobs) {
    await client.query(
      `INSERT INTO jobpost (
        job_title,
        job_location_type,
        job_category,
        job_type,
        job_location,
        job_experience_level,
        job_technical_skills,
        job_education_qualification,
        job_description,
        job_interview_rounds,
        job_budget,
        job_create_date,
        job_close_date,
        job_status,
        job_created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
      )`,
      [
        job.job_title,
        job.job_location_type,
        job.job_category,
        job.job_type,
        job.job_location,
        job.job_experience_level,
        job.job_technical_skills,
        job.job_education_qualification,
        job.job_description,
        job.job_interview_rounds,
        job.job_budget,
        job.job_create_date,
        job.job_close_date,
        job.job_status,
        job.job_created_by,
      ]
    );
  }
};

export const bootstrapDatabase = async () => {
  await ensureTables();
  await ensureDefaultAdmin();
  await seedLookupTable("location", "location_title", seedLocations);
  await seedLookupTable("category", "category_title", seedCategories);
  await seedDefaultJobs();
};
