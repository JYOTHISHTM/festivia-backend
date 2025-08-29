import bcrypt from 'bcryptjs';
import { IPasswordService } from '../interface/IPasswordService';
import { IPasswordRepository } from '../../repositories/interface/IPasswordRepository';
import { ProfileMessages } from '../../enums/StatusCodes';
import { Roles } from "../../enums/Roles";


 class PasswordService implements IPasswordService{
  constructor(private _passwordRepo: IPasswordRepository) {}

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this._passwordRepo.findUserById(userId);

    if (!user) {
        throw new Error(ProfileMessages.USER_NOT_FOUND);
    }

    if (!user.password) {
        throw new Error(ProfileMessages.PASSWORD_NOT_SET);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
        throw new Error(ProfileMessages.INCORRECT_CURRENT_PASSWORD);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._passwordRepo.updatePassword(userId, hashedPassword);
}



async resetPassword(email: string, newPassword: string, type: Roles): Promise<string> {
  const user = await this._passwordRepo.findUserByEmail(email, type);
  if (!user) throw new Error(ProfileMessages.USER_NOT_FOUND);

  const hashed = await bcrypt.hash(newPassword, 10);
  await this._passwordRepo.updatePasswordByType(email, hashed, type);

  return ProfileMessages.PASSWORD_CHANGED;
}


}


export default PasswordService