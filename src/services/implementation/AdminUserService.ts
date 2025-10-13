import { IAdminUserService } from "../interface/IAdminUserService";
import { IUserRepository } from "../../repositories/interface/IUserRepository";

class AdminUserService implements IAdminUserService {

  constructor(private _userRepository: IUserRepository) { }


  async getUsers(): Promise<object> {
    return await this._userRepository.findAll();
  }

async blockUser(userId: string): Promise<object | null> {
    return await this._userRepository.toggleBlock(userId);
}


}

export default AdminUserService