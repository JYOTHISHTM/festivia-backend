import { IOtp } from "../../models/Otp";

export interface IOtpRepository {
  createOtp(email: string, otp: string, expiresAt: Date): Promise<IOtp>;
  findByEmail(email: string): Promise<IOtp | null>;
  deleteOtp(email: string): Promise<void>;
  findOne(email: string, otp: string): Promise<any | null>;
  deleteByEmail(email: string): Promise<void>;
  saveOtp(email: string, otp: string, expiresAt: Date): Promise<void>;
}
