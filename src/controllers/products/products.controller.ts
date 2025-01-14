import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price } = req.body;
    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({});
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { name, price } = req.body;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: {
        name,
        price,
      },
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const deletedProduct = await prisma.product.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
};
