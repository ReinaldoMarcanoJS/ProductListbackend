import { NextFunction, Request, Response } from "express";
1;
export const productValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, price } = req.body;

  if (!name) {
    res.status(400).json({ message: 'El campo "name" es requerido' });
  }
  if (!price) {
    res.status(400).json({ message: 'El campo "price" es requerido' });

  }

  next();
};
