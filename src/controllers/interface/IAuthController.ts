import { Request, Response } from "express";

export interface IAuthController {
    login(req: Request, res: Response): Promise<Response>;
    refreshToken(req: Request, res: Response): Promise<Response>;
    signUp(req: Request, res: Response): Promise<Response>;
    logout(req: Request, res: Response): Promise<Response>;
    googleCallback(req: Request, res: Response): Promise<Response>;
}
