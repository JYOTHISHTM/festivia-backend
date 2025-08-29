import User from '../../models/User';
import { IPasswordRepository } from '../interface/IPasswordRepository';
import UserModel, { IUser } from "../../models/User";
import CreatorModel from "../../models/Creator";


 class PasswordRepository implements IPasswordRepository {
  async findUserById(userId: string) {
    return await User.findById(userId);
  }

  async updatePassword(userId: string, hashedPassword: string) {
    return await User.findByIdAndUpdate(userId, { password: hashedPassword });
  }


  
    async findUserByEmail(email: string, type: string) {
      if (type === "user") {
        return await UserModel.findOne({ email });
      } else if (type === "creator") {
        return await CreatorModel.findOne({ email });
      } else {
        throw new Error("Invalid type");
      }
    }

    
      async updatePasswordByType(email: string, hashedPassword: string, type: "user" | "creator") {
        if (type === "user") {
          return UserModel.updateOne({ email }, { $set: { password: hashedPassword } });
        } else {
          return CreatorModel.updateOne({ email }, { $set: { password: hashedPassword } });
        }
      }
    
    
  
}


export default PasswordRepository