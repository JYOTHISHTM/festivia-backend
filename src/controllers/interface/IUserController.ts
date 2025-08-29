import { Request, Response } from "express";

export interface IUserController {
  cancelUserTicket(req: Request, res: Response): Promise<void>;
  getUserTickets(req: Request, res: Response): Promise<void>;
  getLayoutAndEvent(req: Request, res: Response): Promise<void>;
  getUser(req: Request, res: Response): Promise<Response|void>;
}
