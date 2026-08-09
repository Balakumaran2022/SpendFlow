import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";
import https from "https";
import connectDB from "./config/db.js";
import expenseRoutes from "./routes/expenseRoutes.js";

dotenv.config();

connectDB();

const app = express();

// High Performance Middlewares
app.use(compression());
app.use(cors());
app.use(express.json());

app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "BalaSpend API Running 🚀",
  });
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "BalaSpend API Health Check 🚀",
  });
});

// Self-Ping Keep-Alive to prevent Render free instance cold starts
const RENDER_URL = "https://spendflow-zh3z.onrender.com/";
if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
  setInterval(() => {
    https.get(RENDER_URL, (res) => {
      console.log(`Keep-alive ping sent to Render. Status Code: ${res.statusCode}`);
    }).on('error', (err) => {
      console.log("Keep-alive ping failed:", err.message);
    });
  }, 10 * 60 * 1000); // Every 10 minutes
}

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
