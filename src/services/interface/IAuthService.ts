import { IUser } from "../../models/User";

export interface IAuthService {
  login(email: string, password: string,role: "user" | "creator"): Promise<any>;

  register(
    name: string,
    email: string,
    password: string,
    role: "user" | "creator"
  ): Promise<{ email: string; message: string; role: string }>;

   logoutUser(userId: string): Promise<void>;

  logoutCreator(creatorId: string): Promise<void>;

  logout(refreshToken: string): Promise<string>;


  refreshAccessToken(
    refreshToken: string,
    type: "user" | "creator"
  ): Promise<string | null>;

 
  findOrCreate(profile: any): Promise<IUser | null>;
}
