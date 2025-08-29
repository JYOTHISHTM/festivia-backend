import { Request, Response } from "express";

export interface IAdminSubscriptionController {
  getSubscriptionPlan(req: Request, res: Response): Promise<Response>;
  deleteSubscription(req: Request, res: Response): Promise<void>;
  createSubscription(req: Request, res: Response): Promise<Response | void>;
}
