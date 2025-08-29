import { Request, Response, NextFunction } from "express";

export const attachErrorMessage = (err: Error, req: Request, res: Response, next: NextFunction) => {
  res.locals.errorMessage = err.message;
  next(err);
};

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
};
