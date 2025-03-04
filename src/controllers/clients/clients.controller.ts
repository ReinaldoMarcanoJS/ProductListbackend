import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 } from "uuid";

const prisma = new PrismaClient();

//GET USERS

export const getClients = async (req: Request, res: Response) => {
  try {
    const users = await prisma.clients.findMany({});
    res.status(200).json(users);
    return;
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
    return;
  }
};

//GET USER

export const getClient = async (req: Request, res: Response) => {
  try {
    const user = await prisma.clients.findUnique({
      where: { id: req.params.id },
    });
    res.status(200).json(user);
    return;
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
    return;
  }
};

//CREATE CLIENT

export const createClient = async (req: Request, res: Response) => {
  const { name, email, code, userId } = req.body;
  try {
    const highestCodeProduct = await prisma.clients.findFirst({
        where: { userId: userId },
        orderBy: { code: 'desc' },
      });
  
      const newCode = highestCodeProduct ? highestCodeProduct.code + 1 : 1;
    
    const newUser = await prisma.clients.create({
      data: {
        id: v4(),
        name,
        email,
        code : newCode,
        userId,
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
      console.error(error);
      res.status(400).json({ message: (error as any).message });
      return;
  }
};


//UPDATE USER

export const updateClient = async (req: Request, res: Response) => {
  try {
    const updatedUser = await prisma.clients.update({
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

export const deleteClient = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const deletedUser = await prisma.clients.delete({
      where: { id: id },
    });
    res.status(200).json(deletedUser);
    return
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
    return
  }
};
