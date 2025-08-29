import { Request, Response } from "express";
import { IAdminUserController } from "../interface/IAdminUserController";
import { IAdminUserService } from '../../services/interface/IAdminUserService'
import { userDTO } from "../../dto/userDto";
import { StatusCodes, Messages } from "../../enums/StatusCodes";




class AdminUserController implements IAdminUserController {

  private _adminUserService: IAdminUserService;

  constructor(adminUserService: IAdminUserService) {
    this._adminUserService = adminUserService;
  }


  async getUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this._adminUserService.getUsers();
      const safeUsers = users.map(userDTO);
      return res.status(StatusCodes.OK).json(safeUsers);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: Messages.ERROR_REJECTING_USERS,
        error,
      });
    }
  }



  async blockUser(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      const user = await this._adminUserService.blockUser(userId);
      if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: Messages.USER_NOT_FOUND });
      return res.status(StatusCodes.OK).json({
        message: user.isBlocked ? Messages.USER_BLOCKED_SUCCESSFULLY : Messages.USER_UNBLOCKED_SUCCESSFULLY,
        user: userDTO(user)
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.ERROR_UPDATING_USER_STATUS, error });
    }
  }
}


export default AdminUserController