import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const db = new Pool({
  connectionString: process.env.DB_URL,
});

export const connectDB = async () => {
  try {
    await db.connect();
    console.log("PostgreSQL Connected");
  } catch (err: unknown) {
    console.error("DB Error:", err);
    process.exit(1);
  }
};