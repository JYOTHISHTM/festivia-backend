// BACKEND/src/models/Otp.ts
import mongoose, { Document, Model } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}

const otpSchema = new mongoose.Schema<IOtp>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const OtpModel: Model<IOtp> = mongoose.model<IOtp>("Otp", otpSchema);

export default OtpModel;
