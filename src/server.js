import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import studentRoutes from "./routes/student.routes.js";
import { notFound, errorHandler } from "./middlewares/error.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// API base
app.get("/health", (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));
app.use("/api/alunos", studentRoutes);

// middlewares finais
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`Server rodando em http://localhost:${PORT}`);
  });
})();
