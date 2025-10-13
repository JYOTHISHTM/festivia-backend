import { IUser } from "../../models/User";
import { ICreator } from "../../models/Creator";
import { Roles } from "../../enums/Roles";
import User from "../../models/User";
export interface IAuthRepository {
  clearUserRefreshToken(userId: string): Promise<void>;
  clearCreatorRefreshToken(creatorId: string): Promise<void>;
  deleteOTP(email: string): Promise<void>;
  saveOTP(email: string, otp: string, expiresAt: Date): Promise<void>;
  updateRefreshToken(userId: string, refreshToken: string, type: Roles): Promise<IUser | ICreator | null>;
  findByRefreshToken(refreshToken: string, type: Roles): Promise<IUser | ICreator | null>;
  clearRefreshToken(userId: string, type: Roles): Promise<void>;
  saveOtpToUser(email: string, otp: string, type: Roles): Promise<{ matchedCount: number; modifiedCount: number }>;
  deleteByEmail(email: string, type: Roles): Promise<{ deletedCount: number }>;
  findByGoogleId(googleId: string): Promise<IUser | null>;
  findByEmail(email: string, type: Roles): Promise<IUser | ICreator | null>;
  findUserByEmail(email: string, type: Roles): Promise<IUser | ICreator | null>;
  createUser(data: Parameters<typeof User.create>[0]): Promise<IUser>;
}