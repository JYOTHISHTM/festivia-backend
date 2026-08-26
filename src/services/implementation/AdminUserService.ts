import { IAdminUserService } from "../interface/IAdminUserService";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { IUser } from "../../models/User";

class AdminUserService implements IAdminUserService {

  constructor(private _userRepository: IUserRepository) { }


  async getUsers(): Promise<IUser[]> {
    return await this._userRepository.findAll();
  }

async blockUser(userId: string): Promise<IUser | null> {
    return await this._userRepository.toggleBlock(userId);
}


}

export default AdminUserService