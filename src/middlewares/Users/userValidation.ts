import { NextFunction, Request, Response } from "express";
1;
export const userValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  if (!name) {
    res.status(400).json({ message: 'El campo "name" es requerido' });
  }

  if (!email) {
    res.status(400).json({ message: 'El campo "email" es requerido' });
  }

  if (!email.match(/^\S+@\S+\.\S+$/)) {
    res
      .status(400)
      .json({ message: 'El campo "email" no tiene un formato válido' });
  }

  if (!password) {
    res.status(400).json({ message: 'El campo "password" es requerido' });
  }

  next();
};
