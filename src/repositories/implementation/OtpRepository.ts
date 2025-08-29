import OTP, { IOtp } from "../../models/Otp";
import { IOtpRepository } from "../interface/IOtpRepository";

export class OtpRepository implements IOtpRepository {
  async createOtp(email: string, otp: string, expiresAt: Date): Promise<IOtp> {
    return OTP.create({ email, otp, expiresAt });
  }

  async findByEmail(email: string): Promise<IOtp | null> {
    return OTP.findOne({ email });
  }

  async deleteOtp(email: string): Promise<void> {
    await OTP.deleteOne({ email });
  }

  //  async findOne(email: string, otp: string): Promise<any | null> {
  //   return OTP.findOne({ email, otp });
  // }

  async findOne(email: string, otp: string): Promise<any | null> {
  try {
    console.log("=== OTP REPOSITORY findOne START ===");
    console.log("OTP query input:", { email, otp, otpLength: otp?.length });
    
    const record = await OTP.findOne({ email, otp });
    
    console.log("OTP query result:", record);
    console.log("Record found:", !!record);
    if (record) {
      console.log("Record details:", {
        id: record._id,
        email: record.email,
        otp: record.otp,
        expiresAt: record.expiresAt,
      });
    }
    console.log("=== OTP REPOSITORY findOne END ===");
    
    return record;
  } catch (error) {
    console.error("Error in OTP findOne:", error);
    throw error;
  }
}
  
  async deleteByEmail(email: string): Promise<void> {
    await OTP.deleteOne({ email });
  }

  async saveOtp(email: string, otp: string, expiresAt: Date): Promise<void> {
    await OTP.create({ email, otp, expiresAt });
  }
}
