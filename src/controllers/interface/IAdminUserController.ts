import { Request, Response } from "express";

export interface IAdminUserController {
  getUsers(req: Request, res: Response): Promise<Response>;
  blockUser(req: Request, res: Response): Promise<Response>;
}
