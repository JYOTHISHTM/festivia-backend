import { IUser } from "../../models/User";
import { AuthStatus } from "../../enums/AuthStatus";
import { Roles } from "../../enums/Roles";

export interface GoogleProfile {
  id: string;
  displayName: string;
  emails?: { value: string; verified?: boolean }[];
}

export interface LoginResult {
  status: AuthStatus | "success" | "error" | "pending" | "rejected" | string;
  message?: string;
  token?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email?: string;
    name?: string;
    status?: string;
  };
}

export interface IAuthService {
  login(
    email: string,
    password: string,
    role: Roles | "user" | "creator"
  ): Promise<LoginResult>;

  register(
    name: string,
    email: string,
    password: string,
    role: Roles | "user" | "creator"
  ): Promise<{
    email: string;
    message: string;
    role: string;
  }>;

  logoutUser(userId: string): Promise<void>;

  logoutCreator(creatorId: string): Promise<void>;

  logout(refreshToken: string): Promise<string>;

  refreshAccessToken(
    refreshToken: string,
    type: Roles | "user" | "creator"
  ): Promise<string | null>;

  findOrCreate(profile: GoogleProfile): Promise<IUser | null>;
}