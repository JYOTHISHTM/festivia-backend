
// export interface IAdminUserService {
//     blockUser(userId: string): Promise<object | null>;
//     getUsers(): Promise<object>
// }



import { IUser } from "../../models/User";

export interface IAdminUserService {
    blockUser(userId: string): Promise<IUser | null>;
    getUsers(): Promise<IUser[]>;
}