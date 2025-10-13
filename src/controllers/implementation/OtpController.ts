import { Request, Response } from "express";
import { IOtpController } from "../interface/IOtpController";
import { StatusCodes } from "../../enums/StatusCodes";
import { AuthMessages } from "../../enums/StatusCodes";
import { IOtpService } from "../../services/interface/IOtpService";
import { Roles } from "../../enums/Roles";
import { AxiosError } from "axios";

class OtpController implements IOtpController {
  constructor(private _otpService: IOtpService) { }

  private _isValidRole(role: string): boolean {
    return Object.values(Roles).includes(role as Roles);
  }


  async sendOtp(req: Request, res: Response): Promise<Response> {
    const { email, type } = req.body;

    if (!email || !this._isValidRole(type)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: AuthMessages.INVALID_REQUEST_DATA,
      });
    }

    try {
      const result = await this._otpService.sendOtp(email, type);
      return res.status(StatusCodes.OK).json({
        success: true,
        message: result.message,
        otp: result.otp,
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async resendOTP(req: Request, res: Response): Promise<Response> {
    const { email, type } = req.body;
console.log("type emil in contrl",email,type);

    if (!email || !this._isValidRole(type)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: AuthMessages.INVALID_REQUEST_DATA,
      });
    }

    try {
      const result = await this._otpService.resendOTP(email, type);
      console.log("result in contrl",result);
      
      return res.status(StatusCodes.OK).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

async verifyOTP(req: Request, res: Response): Promise<void> {
  try {
    const { email, otp, userType } = req.body;
    if (!email) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, error: "Email is required" });
      return;
    }
    if (!otp) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, error: "OTP is required" });
      return;
    }
    if (!userType) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, error: "User type is required" });
      return;
    }

    if (!["user", "creator"].includes(userType.toLowerCase())) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, error: "Invalid user type" });
      return; 
    }
    const result = await this._otpService.verifyOTP(email, otp, userType);
    res.status(StatusCodes.OK).json({ 
      success: true, 
      message: result.message, 
      data: result 
    });
  } catch (err) {
      const error = err as AxiosError<{ message: string }>;

    console.error("Error message:", error.message);
    
    const errorMessage = (error as Error).message;
    
    res.status(StatusCodes.BAD_REQUEST).json({ 
      success: false, 
      error: errorMessage 
    });
    
  }
}


  async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp, type } = req.body;
      if (!type) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Type is required (user/creator)" });
      }
        const isValid = await  this._otpService.verifyOtp(email, otp, type);
      if (!isValid) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid OTP" });
      }
  
      return res.status(StatusCodes.OK).json({ message: "OTP verified successfully" });
    } catch (err) {
      console.error("❌ Error verifying OTP:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
    }
  }

}

export default OtpController;
