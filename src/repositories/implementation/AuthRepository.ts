import UserModel, { IUser } from "../../models/User";
import CreatorModel, { ICreator } from "../../models/Creator";
import OTPModel from "../../models/Otp";
import { IAuthRepository } from "../interface/IAuthRepository";
import { Roles } from "../../enums/Roles";

class AuthRepository implements IAuthRepository {
  async clearUserRefreshToken(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { refreshToken: "" });
  }

  async clearCreatorRefreshToken(creatorId: string): Promise<void> {
    await CreatorModel.findByIdAndUpdate(creatorId, { refreshToken: "" });
  }

  async findUserByEmail(email: string, type: Roles): Promise<IUser | ICreator | null> {
    console.log("eml,type in repo ", email, type);

    if (type === Roles.USER) {
      return await UserModel.findOne({ email });
    } else if (type === Roles.CREATOR) {
      return await CreatorModel.findOne({ email });
    } else {
      throw new Error("Invalid type");
    }
  }

  async deleteOTP(email: string): Promise<void> {
    await OTPModel.deleteOne({ email });
  }

  async saveOTP(email: string, otp: string, expiresAt: Date): Promise<void> {
    await OTPModel.create({ email, otp, expiresAt });
  }

  async updateRefreshToken(userId: string, refreshToken: string, type: Roles): Promise<IUser | ICreator | null> {
    if (type === Roles.USER) {
      return await UserModel.findByIdAndUpdate(userId, { refreshToken }, { new: true });
    } else {
      return await CreatorModel.findByIdAndUpdate(userId, { refreshToken }, { new: true });
    }
  }

  async findByRefreshToken(refreshToken: string, type: Roles): Promise<IUser | ICreator | null> {
    return type === Roles.USER
      ? await UserModel.findOne({ refreshToken })
      : await CreatorModel.findOne({ refreshToken });
  }

  async clearRefreshToken(userId: string, type: Roles): Promise<void> {
    if (type === Roles.USER) {
      await UserModel.findByIdAndUpdate(userId, { refreshToken: "" });
    } else {
      await CreatorModel.findByIdAndUpdate(userId, { refreshToken: "" });
    }
  }

  async saveOtpToUser(email: string, otp: string, type: Roles): Promise<{ matchedCount: number; modifiedCount: number }> {
    if (type === Roles.USER) {
      return await UserModel.updateOne({ email }, { $set: { otp } });
    } else {
      return await CreatorModel.updateOne({ email }, { $set: { otp } });
    }
  }

  async deleteByEmail(email: string, type: Roles): Promise<{ deletedCount: number }> {
    return type === Roles.USER
      ? await UserModel.deleteOne({ email: new RegExp(`^${email}$`, 'i') })
      : await CreatorModel.deleteOne({ email: new RegExp(`^${email}$`, 'i') });
  }

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return await UserModel.findOne({ googleId });
  }

  async findByEmail(email: string, type: Roles): Promise<IUser | ICreator | null> {
    if (type === Roles.USER) {
      return await UserModel.findOne({ email });
    } else if (type === Roles.CREATOR) {
      return await CreatorModel.findOne({ email });
    } else {
      throw new Error("invalid role type");
    }
  }

  async createUser(data: Parameters<typeof UserModel.create>[0]): Promise<IUser> {
    return await UserModel.create(data);
  }
}

export default AuthRepository;