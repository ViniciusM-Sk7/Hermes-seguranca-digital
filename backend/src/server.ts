import "dotenv/config";
import express from "express";
import path from "node:path";
import cors from "cors";
import { connectDatabase } from "./config/database";
import userRoutes from "./routes/userRoutes";
import questionRoutes from "./routes/questionRoutes";
import answerRoutes from "./routes/answerRoutes";
import attemptRoutes from "./routes/attemptRoutes";
// import progressRoutes from "./routes/progressRoutes";

const app = express();

const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/attempts", attemptRoutes);
// app.use("/api/progress", progressRoutes);

app.get("/api", (_req, res) => {
  res.json({
    message: "API funcionando!"
  });
});

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  }
}

app.use(
  "/questions/images",
  express.static(path.join(process.cwd(), "src/data/questions/images"))
);

const frontendPath = path.resolve(process.cwd(), "../frontend/dist");

app.use(express.static(frontendPath));

app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api/")) {
    return next();
  }

  res.sendFile(path.join(frontendPath, "index.html"), (error) => {
    if (error) next(error);
  });
});

startServer();
