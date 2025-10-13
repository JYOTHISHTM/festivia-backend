import dotenv from "dotenv";
import { sendMail, OTP_EMAIL_TEMPLATE } from "../../utils/mailer";
import { IOtpService } from "../interface/IOtpService";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { ICreatorRepository } from "../../repositories/interface/ICreatorRepository";
import { IAuthRepository } from "../../repositories/interface/IAuthRepository";
import { Roles } from "../../enums/Roles";
import { OtpMessages } from "../../enums/StatusCodes";
import { IOtpRepository } from "../../repositories/interface/IOtpRepository";

dotenv.config();

class OtpService implements IOtpService {
    private _userRepository: IUserRepository;
    private _creatorRepository: ICreatorRepository;
    private _authRepository: IAuthRepository;
    private _otpRepository: IOtpRepository;

    constructor(
        userRepository: IUserRepository,
        creatorRepository: ICreatorRepository,
        authRepository: IAuthRepository,
        otpRepository: IOtpRepository
    ) {
        this._userRepository = userRepository;
        this._creatorRepository = creatorRepository;
        this._authRepository = authRepository;
        this._otpRepository = otpRepository;
    }

    private generateOTP(): string {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    async verifyOTP(email: string, otp: string, userType: Roles) {
  try {
    console.log("=== OTP SERVICE verifyOTP START ===");
    console.log("Service input:", { email, otp, userType, otpLength: otp?.length });
    
    // Step 1: Get repository
    const repository = userType === Roles.USER ? this._userRepository : this._creatorRepository;
    console.log("Selected repository:", userType === Roles.USER ? "USER" : "CREATOR");
    
    // Step 2: Find user
    console.log("Looking for user with email:", email);
    const user = await repository.findOne({ email });
    console.log("User found:", !!user);
    
    if (!user) {
      console.log("User not found - throwing error");
      throw new Error(
        userType === Roles.USER
          ? OtpMessages.USER_NOT_FOUND
          : OtpMessages.CREATOR_NOT_FOUND
      );
    }
    
    console.log("User details:", {
      id: user._id,
      email: user.email,
      isVerified: user.isVerified
    });
    
    // Step 3: Find OTP record
    console.log("Looking for OTP record...");
    const otpRecord = await this._otpRepository.findOne(email, otp);
    console.log("OTP record found:", !!otpRecord);
    
    if (!otpRecord) {
      console.log("OTP record not found - throwing INVALID_OTP error");
      throw new Error(OtpMessages.INVALID_OTP);
    }
    
    // Step 4: Check expiration
    console.log("Checking OTP expiration...");
    console.log("Current time:", new Date());
    console.log("OTP expires at:", otpRecord.expiresAt);
    
    if (otpRecord.expiresAt && otpRecord.expiresAt < new Date()) {
      console.log("OTP expired - deleting and throwing error");
      await this._otpRepository.deleteByEmail(email);
      throw new Error(OtpMessages.OTP_EXPIRED);
    }
    
    // Step 5: Update user verification
    console.log("Updating user verification status...");
    user.isVerified = true;
    await user.save();
    console.log("User verification updated successfully");
    
    // Step 6: Delete OTP record
    console.log("Deleting OTP record...");
    await this._otpRepository.deleteByEmail(email);
    console.log("OTP record deleted successfully");
    
    const result = { email, message: `${userType} ${OtpMessages.ACCOUNT_VERIFIED}` };
    console.log("Service result:", result);
    console.log("=== OTP SERVICE verifyOTP END ===");
    
    return result;
    
  } catch (error) {
    const err=error as Error
    console.error("=== ERROR in OTP SERVICE ===");
    console.error("Error type:", err.constructor.name);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    console.log("=== OTP SERVICE verifyOTP ERROR END ===");
    throw error; 
  }
}

    async verifyOtp(email: string, otp: string, userType: Roles): Promise<boolean> {
        const record = await this._authRepository.findByEmail(email, userType);
        return !!(record && record.otp == otp);
    }










    async resendOTP(email: string, type: Roles): Promise<{ message: string }> {
        const userOrCreator = await this._authRepository.findByEmail(email, type);
        console.log("userOrCreator in serv",userOrCreator);
        
        if (!userOrCreator) {
            throw new Error(
                type === Roles.USER
                    ? OtpMessages.USER_NOT_FOUND
                    : OtpMessages.CREATOR_NOT_FOUND
            );
        }

        await this._authRepository.deleteOTP(email);

        const newOtp = this.generateOTP();
        const expiresAt = new Date(Date.now() + 60 * 1000);

        await this._authRepository.saveOTP(email, newOtp, expiresAt);

        const emailTemplate = OTP_EMAIL_TEMPLATE(newOtp);
        await sendMail(email, emailTemplate.subject, emailTemplate.message);

        return { message: OtpMessages.NEW_OTP_SENT };
    }

    async sendOtp(email: string, type: Roles): Promise<{ message: string; otp: string }> {
        const found = await this._authRepository.findUserByEmail(email, type);
        if (!found)
            throw new Error(
                type === Roles.USER
                    ? OtpMessages.USER_NOT_FOUND
                    : OtpMessages.CREATOR_NOT_FOUND
            );

        const otp = this.generateOTP();
        await this._authRepository.saveOtpToUser(email, otp, type);

        const emailTemplate = OTP_EMAIL_TEMPLATE(otp);
        await sendMail(email, emailTemplate.subject, emailTemplate.message);

        return { message: OtpMessages.OTP_SENT, otp };
    }


}

export default OtpService;
