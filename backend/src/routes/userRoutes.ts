import { Router } from "express";
import { createUser, loginUser } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", createUser);
router.post("/login", loginUser);

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Rota protegida acessada com sucesso!",
    userId: req.user?.userId
  });
});

export default router;