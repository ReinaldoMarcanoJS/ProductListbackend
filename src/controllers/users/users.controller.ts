import { Request, Response } from "express";
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}
import { PrismaClient } from "@prisma/client";
import { v4 } from "uuid";
import bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import jwt from "jsonwebtoken";

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

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    // Handle user not found
    if (!user) {
      res.status(401).json({ message: "error" , type : "Invalid Email" });
      return;
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "error", type: "Invalid password" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name}, secretKey, {
      expiresIn: "30d", // Use lowercase 'd' for days
    });

    // Send successful login response
    res.json({ token });
    return;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(error.message);
      res.status(500).json({ message: "An error occurred during login" });
      return;
    } else {
      console.error(error);
      res.status(500).json({ message: "An unexpected error occurred" });
      return;
    }
  }
};

export const createUser = async (req: Request, res: Response) => {
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
      // Handle other errors (e.g., logging, generic error response)
      console.error(error);
      res.status(400).json({ message: (error as any).message });
      return;
    }
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({});
    res.status(200).json(users);
    return;
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
    return;
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    res.status(200).json(user);
    return;
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
    return;
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(200).json(updatedUser);
    return
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
    return
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: id },
    });
    res.status(200).json(deletedUser);
    return
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
    return
  }
};

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
