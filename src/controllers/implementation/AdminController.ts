import { Request, Response } from "express";
import dotenv from "dotenv";
import { IAdminController } from "../../controllers/interface/IAdminController";
import { IAdminService } from "../../services/interface/IAdminService";
import { StatusCodes, Messages } from "../../enums/StatusCodes";
import { AuthMessages } from "../../enums/StatusCodes";

  

dotenv.config();

class AdminController implements IAdminController {

  private _adminService: IAdminService;

  constructor(adminService: IAdminService) {
    this._adminService = adminService;
  }


  async getDashboardData(req: Request, res: Response): Promise<void> {
    try {
      const data = await this._adminService.getDashboardData();
      res.json(data);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.INTERNAL_SERVER_ERROR });
    }
  }



  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { username, password } = req.body;
      const { token, refreshToken, admin } = await this._adminService.login(username, password);

      res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });

      return res.status(StatusCodes.OK).json({
        message: Messages.LOGIN_SUCCESSFUL,
        isAdmin: true,
        token,
        admin: { id: admin._id, username: admin.username }
      });
    } catch (error) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: (error as Error).message });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<Response | void> {
    try {
      const { refreshToken } = req.cookies;
      const newAccessToken = await this._adminService.refreshToken(refreshToken);

      if (!newAccessToken) {
        res.clearCookie("refreshToken");
        return res.status(StatusCodes.FORBIDDEN).json({ error: AuthMessages.INVALID_REFRESH_TOKEN });
      }

      res.json({ token: newAccessToken });
    } catch {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: Messages.INTERNAL_SERVER_ERROR });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.cookies;
      await this._adminService.logout(refreshToken);

      res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
      res.status(StatusCodes.OK).json({ message: Messages.LOGGED_OUT_SUCCESSFULLY });
    } catch {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: Messages.INTERNAL_SERVER_ERROR });
    }
  }
}

export default AdminController;
