import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 } from "uuid";
import bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import jwt from "jsonwebtoken";
import { verifyToken } from "../../middlewares/verify/verifyToken";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

interface PrismaUniqueConstraintViolationError
  extends PrismaClientKnownRequestError {
  code: "P2002";
  meta: {
    target: string[];
  };
}

function isUniqueConstraintViolationError(
  error: unknown
): error is PrismaUniqueConstraintViolationError {
  return (error as PrismaUniqueConstraintViolationError).code === "P2002";
}

const prisma = new PrismaClient();
const secretKey = process.env.JWTKey || "SECRET_KEY";

//LOGIN

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const user = await prisma.user.findFirst({ where: { email: email } });
    console.log(user);

    if (!user) {
      res.status(404).json({ message: "error", type: "Email Not Found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "error", type: "Invalid Password" });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
      expiresIn: "10D",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//REGISTER

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
    const newUser = await prisma.user.create({
      data: {
        id: v4(),
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "ok",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    });
    return;
  } catch (error) {
    if (isUniqueConstraintViolationError(error)) {
      res.status(400).json({ message: "error", type: "Email already exist" });
      return;
    } else {
      console.error(error);
      res.status(400).json({ message: (error as any).message });
      return;
    }
  }
};

//GET PROFILE

export const getProfile = (req: AuthenticatedRequest, res: Response) => {
  const token = req.body.token;
 
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    console.log(decoded);

    const user = req.user;
    res.status(200).json({ message: "ok", user });
    return;
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};

export const logout = (req: AuthenticatedRequest, res: Response) => {
  const token = req.body.token;

  try {
    jwt.verify(token, secretKey);
    // Invalidate the token here if you have a token blacklist or similar mechanism
    res.status(200).json({ message: "ok", type: "Logged out successfully" });
  } catch (error) {
    res.status(401).json({ message: "error", type: "Invalid token" });
  }
};
