import { IAuthService } from "../interface/IAuthService";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { ICreatorRepository } from "../../repositories/interface/ICreatorRepository";
import { IAuthRepository } from "../../repositories/interface/IAuthRepository";
import { IOtpRepository } from "../../repositories/interface/IOtpRepository";
import { sendMail } from "../../utils/mailer";
import { ITokenService } from "../../utils/tokenService";
import { IPasswordHasher } from "../../utils/passwordHasher";
import { IUser } from "../../models/User";
import { AuthMessages } from "../../enums/StatusCodes";
import { Roles } from "../../enums/Roles";
import { generateOTP } from "../../utils/otpGenerator";
import { AuthStatus } from "../../enums/AuthStatus";
import { OTP_EMAIL_TEMPLATE } from "../../utils/otpEmailTemplate";

class AuthService implements IAuthService {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _creatorRepository: ICreatorRepository,
    private readonly _authRepository: IAuthRepository,
    private readonly _otpRepository: IOtpRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _tokenService: ITokenService
  ) { }



  async login(email: string, password: string, role: Roles) {
    const repository = role === Roles.USER ? this._userRepository : this._creatorRepository;
    const user = await repository.findByEmail(email);

    if (!user) return { status: AuthStatus.ERROR, message: AuthMessages.INVALID_CREDENTIALS };
    if (user.isBlocked) throw new Error(AuthMessages.ACCOUNT_BLOCKED);
    if (!user.password) throw new Error(AuthMessages.PASSWORD_MISSING);

    const isPasswordValid = await this._passwordHasher.compare(password, user.password);
    if (!isPasswordValid) return { status: AuthStatus.ERROR, message: AuthMessages.INVALID_CREDENTIALS };

    if (role === Roles.CREATOR && "status" in user) {
      if (user.status === AuthStatus.PENDING) {
        return { status: AuthStatus.PENDING, message: AuthMessages.PENDING_APPROVAL, user: { id: user._id } };
      }
      if (user.status === AuthStatus.REJECTED) {
        return { status: AuthStatus.REJECTED, message: user.rejectionReason || AuthMessages.REJECTED_ACCOUNT, user: { id: user._id } };
      }
    }

    const token = this._tokenService.generateAccessToken({ id: user._id });
    const refreshToken = this._tokenService.generateRefreshToken({ id: user._id });
    await repository.updateRefreshToken(user._id, refreshToken);

    return {
      status: AuthStatus.APPROVED,
      token,
      refreshToken,
      user: { id: user._id, email: user.email, name: user.name, status: "status" in user ? user.status : undefined }
    };
  }

  async register(name: string, email: string, password: string, role: Roles) {
    const repository = role === Roles.USER ? this._userRepository : this._creatorRepository;
    const existingUser = await repository.findByEmail(email);
    if (existingUser) throw new Error(AuthMessages.EMAIL_ALREADY_IN_USE);

    const hashedPassword = await this._passwordHasher.hash(password);
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 60 * 1000);
    const { subject, message, } = OTP_EMAIL_TEMPLATE(otp);
    await sendMail(email, subject, message);


    await this._otpRepository.createOtp(email, otp, expiresAt);
    // await sendMail(email, "Your OTP Code 5555", `Your OTP is 666: ${otp}`);
    // await sendMail(email, "FESTIVIA - Your OTP Code", OTP_EMAIL_TEMPLATE(otp));


    const data: any = { name, email, password: hashedPassword, isVerified: false };
    if (role === Roles.CREATOR) data.isAdminApproved = false;

    await repository.create(data);
    return { email, message: AuthMessages.OTP_SENT, role };
  }

  async logout(refreshToken: string): Promise<string> {
    if (!refreshToken) throw new Error(AuthMessages.NO_REFRESH_TOKEN);

    const decoded = this._tokenService.verifyRefreshToken(refreshToken);
    if (!decoded || !decoded.id) throw new Error(AuthMessages.INVALID_REFRESH_TOKEN);

    await this._authRepository.clearUserRefreshToken(decoded.id);
    return AuthMessages.LOGOUT_SUCCESS;
  }

  async logoutUser(userId: string): Promise<void> {
    await this._authRepository.clearUserRefreshToken(userId);
  }

  async logoutCreator(creatorId: string): Promise<void> {
    await this._authRepository.clearCreatorRefreshToken(creatorId);
  }

  async refreshAccessToken(refreshToken: string, type: Roles): Promise<string | null> {
    if (!refreshToken) return null;

    const user = await this._authRepository.findByRefreshToken(refreshToken, type);
    if (!user) return null;

    const decoded = this._tokenService.verifyRefreshToken(refreshToken);
    if (!decoded) return null;

    return this._tokenService.generateAccessToken({ id: user._id });
  }

  async findOrCreate(profile: any): Promise<IUser | null> {
    let user = await this._authRepository.findByGoogleId(profile.id);
    if (!user) {
      user = await this._authRepository.createUser({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
      });
    }
    return user;
  }
}

export default AuthService;
