export interface IOtpService {

    verifyOTP(
        email: string,
        otp: string,
        userType: "user" | "creator"
    ): Promise<{ email: string; message: string }>;
    sendOtp(
        email: string,
        type: "user" | "creator"
    ): Promise<{ message: string; otp: string }>;

    verifyOtp(
        email: string,
        otp: string,
        userType: "user" | "creator"
    ): Promise<boolean>;

    resendOTP(email: string, userType: "user" | "creator"): Promise<{ message: string }>;


}
