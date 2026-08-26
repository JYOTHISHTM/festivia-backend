import { IUser } from "../../models/User"; 
import { ICreator } from "../../models/Creator";

export interface IPasswordRepository {
  findUserById(userId: string): Promise<IUser | null>;

  updatePassword(userId: string, hashedPassword: string): Promise<IUser | null>;
  findUserByEmail(email: string, type: string): Promise<IUser | ICreator | null>;

  updatePasswordByType(email: string, hashedPassword: string, type: "user" | "creator"): Promise<object>;
}
