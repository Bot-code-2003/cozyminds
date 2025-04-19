// index.js
import express, { urlencoded } from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import mailRoutes from "./routes/mailRoutes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const mongoURL = process.env.MONGODB_URL;

app.use(cors({ origin: "https://cozyminds.vercel.app" }));
app.options("*", cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello from Cozy Minds!");
});

app.use("/user", userRoutes);
app.use("/journal", journalRoutes);
app.use("/mail", mailRoutes);

// ✅ MongoDB connect here, but don't use app.listen()
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default app; // ✅ export instead of listen
