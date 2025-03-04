import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

//GET USERS

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

//GET USER

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

//UPDATE USER

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(updatedUser);
    return
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
    return
  }
};

//DELETE USER

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
