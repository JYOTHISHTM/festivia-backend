import { IUser } from "../../models/User"; 

export interface IPasswordRepository {
  findUserById(userId: string): Promise<IUser | null>;

  updatePassword(userId: string, hashedPassword: string): Promise<IUser | null>;
   findUserByEmail(email: string, type: "user" | "creator"): Promise<any>;
  
    updatePasswordByType(email: string, hashedPassword: string, type: "user" | "creator"): Promise<any>;
  
}
