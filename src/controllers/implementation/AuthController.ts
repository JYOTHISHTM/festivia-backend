import { Request, Response } from "express";
import { IAuthController } from "../interface/IAuthController";
import { StatusCodes } from "../../enums/StatusCodes";
import { AuthMessages } from "../../enums/StatusCodes";
import { IAuthService } from "../../services/interface/IAuthService";


class AuthController implements IAuthController {

  constructor(private readonly _authService: IAuthService) { }


async login(req: Request, res: Response): Promise<Response> {
  try {
    const { email, password, role } = req.body;

    const result = await this._authService.login(email, password, role);

    if (!result || result.status === "error") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: result?.message || AuthMessages.INVALID_CREDENTIALS,
      });
    }

    if (result.status === "pending" || result.status === "rejected") {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: result.message,
        status: result.status,
        user: result.user,
      });
    }

    if (!result.user || !result.token || !result.refreshToken) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: AuthMessages.INTERNAL_SERVER_ERROR,
      });
    }

    const { token, refreshToken, user } = result;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    if (role === "creator") {
      return res.json({
        token,
        creator: {
          id: user.id,
          email: user.email,
          name: user.name,
          status: user.status,
        },
        status: result.status,
      });
    }

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    const error = err as Error;

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message || AuthMessages.INTERNAL_SERVER_ERROR,
    });
  }
}
  async signUp(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, role } = req.body;
      if (role !== "user" && role !== "creator") {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, error: AuthMessages.INVALID_ROLE });
      }

      const result = await this._authService.register(name, email, password, role);
      return res.status(StatusCodes.CREATED).json({ success: true, message: result.message, data: result });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, error: (error as Error).message });
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) return res.status(StatusCodes.BAD_REQUEST).json({ error: AuthMessages.NO_REFRESH_TOKEN });

      const message = await this._authService.logout(refreshToken);
      res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });

      return res.status(StatusCodes.OK).json({ message });
    } catch (err) {
      const error = err as Error
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message || AuthMessages.INTERNAL_SERVER_ERROR });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<Response> {
    try {
      const { refreshToken } = req.cookies;
      const { type } = req.body;
      if (!refreshToken || !type) return res.sendStatus(StatusCodes.UNAUTHORIZED);

      const newAccessToken = await this._authService.refreshAccessToken(refreshToken, type);
      if (!newAccessToken) {
        res.clearCookie("refreshToken");
        return res.sendStatus(StatusCodes.FORBIDDEN);
      }

      return res.json({ token: newAccessToken });
    } catch {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: AuthMessages.INTERNAL_SERVER_ERROR });
    }
  }

  async googleCallback(req: Request, res: Response): Promise<Response> {
    const user = req.user as { id: string; type: string };
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: AuthMessages.GOOGLE_AUTH_FAILED });
    }
    return res.status(StatusCodes.OK).json({ success: true, user, message: `Logged in successfully as ${user.type}` });
  }
}



export default AuthController;
