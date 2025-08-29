import { Request, Response } from 'express';
import { StatusCodes } from "../../enums/StatusCodes";
import { ITicketController } from '../interface/ITicketController';
import { ITicketService } from '../../services/interface/ITicketService';
import { TicketMessages } from '../../enums/StatusCodes';


class TicketController implements ITicketController {

  constructor(private readonly _ticketService: ITicketService) { }


  async getUsersWhoBoughtTickets(req: Request, res: Response): Promise<void> {
    try {
      const { creatorId, page = '1', limit = '7' } = req.query;

      if (!creatorId || typeof creatorId !== 'string') {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: TicketMessages.INVALID_CREATOR_ID });
        return;
      }

      const pageNumber = parseInt(page as string);
      const limitNumber = parseInt(limit as string);

      const result = await this._ticketService.getUsersWhoBoughtTickets(
        creatorId,
        pageNumber,
        limitNumber
      );

      res.status(StatusCodes.OK).json(result);
    } catch (err) {
            const error=err as Error

      if (error.message ===TicketMessages.INVALID_CREATOR_ID) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: TicketMessages.INVALID_CREATOR_ID });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: TicketMessages.SERVER_ERROR });
      }
    }
  }

  async getTicketSummary(req: Request, res: Response): Promise<Response> {
    try {
      const { creatorId, selectedEventId, page = "1", limit = "2" } = req.query;

      if (!creatorId || typeof creatorId !== "string") {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: TicketMessages.CREATOR_ID_REQUIRED });
      }

      const numericPage = parseInt(page as string);
      const numericLimit = parseInt(limit as string);

      const summary = await this._ticketService.getTicketSummary(
        creatorId,
        selectedEventId as string,
        numericPage,
        numericLimit
      );

      return res.status(StatusCodes.OK).json({ success: true, summary });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: TicketMessages.SERVER_ERROR });
    }
  }

}

export default TicketController;
