import { Request, Response } from "express";

export interface IAdminController {
  login(req: Request, res: Response): Promise<Response>;
  logout(req: Request, res: Response): Promise<void>;
  getDashboardData(req: Request, res: Response): Promise<void>
  refreshToken(req: Request, res: Response): Promise<Response|void> 
}
