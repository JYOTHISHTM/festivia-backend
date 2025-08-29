import { Request, Response } from 'express';
import { StatusCodes } from "../../enums/StatusCodes";
import { IPasswordController } from '../interface/IPasswordController';
import { IPasswordService } from '../../services/interface/IPasswordService';
import { AuthMessages, ProfileMessages } from '../../enums/StatusCodes';

class PasswordController implements IPasswordController {

  constructor(private readonly _passwordService: IPasswordService) { }


  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, type } = req.body;
      const result = await this._passwordService.resetPassword(email, password, type);
      res.status(StatusCodes.OK).json({ success: true, message: result });
    } catch (err) {
      const error = err as Error

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    }
  }


  async changePassword(req: Request, res: Response): Promise<Response> {
    try {
      const { currentPassword, newPassword } = req.body;

      const userId = (req.user as { id: string }).id;
      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: ProfileMessages.UNAUTHORIZED });
      }

      await this._passwordService.changePassword(userId, currentPassword, newPassword);

      return res.status(StatusCodes.OK).json({
        success: true,
        data: { message: AuthMessages.PASSWORD_CHANGED_SUCCESSFULLY }
      });

    } catch (err) {
      const error = err as Error

      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }


}

export default PasswordController