import { NextFunction, Request, Response } from "express";
1;
export const userRegisterValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  

  if (!name) {
    res.status(400).json({ message: "error", type: 'El campo "name" es requerido' });
    return;
  }

  if (!email) {
    res.status(400).json({ message: "error", type: 'El campo "email" es requerido' });
    return;
  }


  if (!email.match(/^\S+@\S+\.\S+$/)) {
    res
      .status(400)
      .json({ message: 'El campo "email" no tiene un formato válido' });
      return;
    }

  if (!password) {
    res.status(400).json({ message: 'El campo "password" es requerido' });
    return;
  }

  next();
};

export const userLoginValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
console.log(req.body), "req.body";
  

  if (!email) {
    res.status(400).json({ message: "error", type: 'El campo "email" es requerido' });
    console.log("email1");
    
    return;
  }

  // if (!email.match(/^\S+@\S+\.\S+$/)) {
  //   res
  //     .status(400)
  //     .json({ message: "error", type: 'El campo "email" no tiene un formato valido' });

  //     return;
  //   }

  if (!password) {
    res.status(400).json({ message: "error", type: 'El campo "password" es requerido' });
    console.log("password");
    
    return;

  }

  next();
};