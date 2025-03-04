import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 } from "uuid";
import jwt from 'jsonwebtoken';
import { verifyToken } from "../../middlewares/verify/verifyToken";
const prisma = new PrismaClient();
const secretKey = process.env.JWTKey || "SECRET_KEY";


export const createProduct = async (req: Request, res: Response) => {
  console.log("hola");
  
  try {
    const { name, price, userId } = req.body;
      // Verificar que el userId existe en la tabla de usuarios
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        res.status(400).json({ message: "User not found" });
        return 
      }

        // Cuenta la cantidad de productos del usuario
    // Obtener el código más alto del producto del usuario
    const highestCodeProduct = await prisma.products.findFirst({
      where: { userId: userId },
      orderBy: { code: 'desc' },
    });

    const newCode = highestCodeProduct ? highestCodeProduct.code + 1 : 1;
  
    const newProduct = await prisma.products.create({
      data: {
        id: v4(), 
        name,
        userId,
        code : newCode,
        price,
      },

    });
    res.status(201).json({newProduct, message: "ok"});
    return
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
};
export const getProducts = async (req: Request, res: Response) => {
  const { token } = req.body;
  console.log(token);
  try {
    const decoded = jwt.verify(token, secretKey);
    console.log(decoded);

    // Aquí puedes agregar la lógica para obtener los productos
    const products = await prisma.products.findMany({
      where: { userId: (decoded as any).id },
    });

    res.status(200).json(products);
    return; 
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
    return;
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await prisma.products.findUnique({
      where: { id: req.params.id },
    });
    res.json({product, message: "ok"});
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { name, price } = req.body;

  try {
    const updatedProduct = await prisma.products.update({
      where: { id: req.params.id },
      data: {
        name,
        price,
      },
    });
    res.status(200).json({updatedProduct, message: "ok"});
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const deletedProduct = await prisma.products.delete({
      where: { id: req.params.id },
    });
    res.status(200).json({deletedProduct , message: "ok"});
    return
  } catch (error) {
    res.status(400).json({ message: (error as any).message });
    return
  }
};
