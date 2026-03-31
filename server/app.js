import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });
import cors from "cors";
import bodyParser from "body-parser";
import authRouter from "./router/authRoutes.js";
import candidatesRouter from "./router/candidatesRoutes.js";
import router from "./router/router.js";
import { bootstrapDatabase } from "./config/bootstrap.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use("/auth", authRouter);
app.use("/candidates", candidatesRouter);
app.use("/api/v1", router);

const startServer = async () => {
  try {
    await bootstrapDatabase();
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
