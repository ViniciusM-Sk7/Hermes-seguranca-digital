import { Router } from "express";
import { createUser, loginUser } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { User } from "../models/User";

const router = Router();

router.post("/", createUser);
router.post("/login", loginUser);

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user!.userId).select(
      "name email points"
    );

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado."
      });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points
      }
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao carregar perfil."
    });
  }
});

export default router;