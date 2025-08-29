import { Request, Response } from "express";

export interface IAdminCreatorController {
  getCreatorsbySearch(req: Request, res: Response): Promise<Response | void>;
  getPendingCreators(req: Request, res: Response): Promise<Response>;
  getCreatorStatus(req: Request, res: Response): Promise<Response>;
  blockCreator(req: Request, res: Response): Promise<Response>;
  reapplyCreator(req: Request, res: Response): Promise<Response | void>;
  getCreators(req: Request, res: Response): Promise<Response>;
  approveCreator(req: Request, res: Response): Promise<Response>;
  rejectCreator(req: Request, res: Response): Promise<Response>;
}
