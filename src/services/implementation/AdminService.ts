import { IAdminService } from "../interface/IAdminService";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { ICreatorRepository } from "../../repositories/interface/ICreatorRepository";
import { IAdminRepository } from "../../repositories/interface/IAdminRepository";
import { IAdmin } from "../../models/Admin";
import { AuthMessages } from "../../enums/StatusCodes";
import { TokenService } from "../../utils/tokenService";
import { PasswordHasher } from "../../utils/passwordHasher";

export default class AdminService implements IAdminService {
  private _userRepository: IUserRepository;
  private _creatorRepository: ICreatorRepository;
  private _adminRepository: IAdminRepository;
  private _tokenService: TokenService;
  private _passwordHasher: PasswordHasher;

  constructor(
    userRepository: IUserRepository,
    creatorRepository: ICreatorRepository,
    adminRepository: IAdminRepository
  ) {
    this._userRepository = userRepository;
    this._creatorRepository = creatorRepository;
    this._adminRepository = adminRepository;
    this._tokenService = new TokenService();
    this._passwordHasher = new PasswordHasher();
  }

  async getDashboardData() {
    return {
      userCount: await this._userRepository.countUsers(),
      creatorCount: await this._creatorRepository.countCreators(),
      pendingApprovals: await this._creatorRepository.countPendings()
    };
  }

  async refreshToken(refreshToken: string): Promise<string | null> {
    if (!refreshToken) return null;

    const admin = await this._adminRepository.findByRefreshToken(refreshToken);
    if (!admin) return null;

    const decoded = this._tokenService.verifyRefreshToken(refreshToken);
    if (!decoded || !decoded.id) {
      await this._adminRepository.updateRefreshToken(admin._id.toString(), "");
      return null;
    }

    return this._tokenService.generateAccessToken({ id: decoded.id });
  }

  async login(username: string, password: string): Promise<{
    token: string;
    refreshToken: string;
    admin: { _id: string; username: string };
  }> {
    const admin: IAdmin | null = await this._adminRepository.findByUsername(username);
    if (!admin) {
      throw new Error(AuthMessages.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await this._passwordHasher.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new Error(AuthMessages.INVALID_CREDENTIALS);
    }

    const adminId: string = admin._id.toString();
    const token = this._tokenService.generateAccessToken({ id: adminId });
    const refreshToken = this._tokenService.generateRefreshToken({ id: adminId });

    await this._adminRepository.updateRefreshToken(adminId, refreshToken);

    return {
      token,
      refreshToken,
      admin: { _id: adminId, username: admin.username }
    };
  }

  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) return;

    const admin = await this._adminRepository.findByRefreshToken(refreshToken);
    if (!admin) return;

    await this._adminRepository.clearRefreshToken(admin._id.toString());
  }
}




