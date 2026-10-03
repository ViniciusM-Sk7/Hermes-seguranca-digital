import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token não informado."
    });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Formato de token inválido."
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      message: "JWT_SECRET não foi definida."
    });
  }

  try {
const decoded = jwt.verify(token, secret);

if (typeof decoded === "string" || !decoded.userId) {
  return res.status(401).json({
    message: "Token inválido."
  });
}

req.user = {
  userId: decoded.userId as string
};

next();
  } catch {
    return res.status(401).json({
      message: "Token inválido ou expirado."
    });
  }
}