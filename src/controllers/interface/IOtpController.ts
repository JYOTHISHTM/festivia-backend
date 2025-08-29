import { Request, Response } from "express";

export interface IOtpController {
    resendOTP(req: Request, res: Response): Promise<Response>;
    // verifyOTP(req: Request, res: Response): Promise<void>;
    verifyOtp(req: Request, res: Response): Promise<Response>;
    sendOtp(req: Request, res: Response): Promise<Response>;
}
