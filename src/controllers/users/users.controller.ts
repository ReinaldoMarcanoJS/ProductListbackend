import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 } from "uuid";
import bcrypt from "bcrypt"

const prisma = new PrismaClient();

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
        "password" : hashedPassword 
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({});
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
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
        password: hashedPassword
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: id },
    });
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
};
