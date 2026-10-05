import { Router } from "express";
import { StudyAttempt } from "../models/StudyAttempt";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const attempts = await StudyAttempt.find({
      userId: req.user!.userId,
      completed: true
    }).sort({ createdAt: -1 });

    const progress: Record<
      string,
      {
        completedLevels: number[];
        score: number;
      }
    > = {};

    for (const attempt of attempts) {
      if (!progress[attempt.path]) {
        progress[attempt.path] = {
          completedLevels: [],
          score: 0
        };
      }

      if (!progress[attempt.path].completedLevels.includes(attempt.level)) {
        progress[attempt.path].completedLevels.push(attempt.level);
      }

      progress[attempt.path].score += attempt.score;
    }

    for (const path of Object.keys(progress)) {
      progress[path].completedLevels.sort((a, b) => a - b);
    }

    return res.status(200).json({
      progress
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao consultar progresso."
    });
  }
});

export default router;