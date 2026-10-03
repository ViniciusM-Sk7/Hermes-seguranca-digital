import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function createUser(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
    message: "Nome, e-mail e senha são obrigatórios."
  });
}

if (password.length < 8) {
  return res.status(400).json({
    message: "A senha deve ter pelo menos 8 caracteres."
  });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Informe um e-mail válido."
  });
}

const hashedPassword = await bcrypt.hash(password, 10);

const user = await User.create({
  name,
  email,
  password: hashedPassword
});

  res.status(201).json({
    message: "Usuário criado com sucesso!",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      points: user.points
  }
});
 } catch (error: any) {
  console.error(error);

  if (error.code === 11000) {
    return res.status(409).json({
      message: "Este e-mail já está cadastrado."
    });
  }

  return res.status(500).json({
    message: "Erro ao criar usuário."
  });
 }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "E-mail e senha são obrigatórios."
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "E-mail ou senha inválidos."
      });
    }
    

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "E-mail ou senha inválidos."
      });
    }

    const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET não foi definida no arquivo .env");
}

const token = jwt.sign(
  {
    userId: user._id.toString()
  },
  secret,
  {
    expiresIn: "1h"
  }
); 
    
return res.status(200).json({
  message: "Login realizado com sucesso!",
  token,
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
      message: "Erro ao realizar login."
    });
  }
}
