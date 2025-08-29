import { ITicketService } from '../interface/ITicketService';
import { ITicketRepository } from '../../repositories/interface/ITicketRepository';
import mongoose from 'mongoose';
import { TicketMessages } from '../../enums/StatusCodes';


class TicketService implements ITicketService {

  constructor(private _ticketRepository: ITicketRepository,) { }

  async getTicketSummary(
    creatorId: string,
    selectedEventId?: string,
    page?: number,
    limit?: number
  ) {
    return await this._ticketRepository.getTicketSummaryByCreator(
      creatorId,
      selectedEventId,
      page,
      limit
    );
  }

    async getUsersWhoBoughtTickets(
    creatorId: string,
    page: number,
    limit: number
  ) {
    if (!mongoose.Types.ObjectId.isValid(creatorId)) {
      throw new Error(TicketMessages.INVALID_CREATOR_ID);
    }

    const skip = (page - 1) * limit;

    const { tickets, totalCount } =
      await this._ticketRepository.getUsersWhoBoughtTicketsByCreator(
        creatorId,
        skip,
        limit
      );

    const users = tickets
      .filter(ticket => ticket.userId && ticket.eventId)
      .map(ticket => ({
        name: (ticket.userId as any).name,
        email: (ticket.userId as any).email,
        eventName: (ticket.eventId as any).eventName,
        amount: ticket.price,
        createdAt: ticket.createdAt.toISOString(),
      }));

    return {
      users,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }
  
}

export default TicketService
