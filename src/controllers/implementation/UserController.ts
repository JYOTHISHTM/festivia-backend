import { Request, Response } from "express";
import { IUserController } from "../interface/IUserController";
import { IUserService } from "../../services/interface/IUserService";
import { StatusCodes } from "../../enums/StatusCodes";
import { UserMessages } from "../../enums/StatusCodes";

class UserController implements IUserController {

  private _userService: IUserService;

  constructor(userService: IUserService) {
    this._userService = userService;
  }

  async getUser(req: Request, res: Response): Promise<Response | void> {
    try {
const userId = (req.user as { id: string }).id;
      
      const user = await this._userService.getUserById(userId);

      if (!user) return res.sendStatus(StatusCodes.NOT_FOUND);

      res.status(StatusCodes.OK).json(user);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: UserMessages.SERVER_ERROR });
    }
  }


  async getUserTickets(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 4;

    const result = await this._userService.getTicketsByUserId(userId, page, limit);
    res.json(result);
  } catch (err) {
    const error = err as Error;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}


  async cancelUserTicket(req: Request, res: Response): Promise<void> {
    try {
      const { userId, ticketId } = req.params;

      const result = await this._userService.cancelTicketAndRefund(ticketId, userId);
      res.json({ message: `Ticket cancelled. ₹${result.refundAmount} refunded to your wallet.` });
    } catch (err) {
      const error = err as Error

      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }

  async getLayoutAndEvent(req: Request, res: Response): Promise<void> {
    try {
      const { layoutId } = req.params;
      const data = await this._userService.fetchLayoutAndEvent(layoutId);
      res.json(data);
    } catch (err) {
      const error = err as Error

      res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }
  }
}

export default UserController;
