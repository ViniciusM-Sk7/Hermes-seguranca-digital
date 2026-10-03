import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/database";
import userRoutes from "./routes/userRoutes";
import questionRoutes from "./routes/questionRoutes";

const app = express();

const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);

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

startServer();
