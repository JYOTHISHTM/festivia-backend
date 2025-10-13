import { ITicketService } from '../interface/ITicketService';
import { ITicketRepository } from '../../repositories/interface/ITicketRepository';
import mongoose from 'mongoose';
import { TicketMessages } from '../../enums/StatusCodes';
import { IUser } from "../../models/User";   // Full IUser
import { IEvent } from "../../models/Event"; // Full IEvent

import { TicketDetails } from "../../dto/TicketDetails";

// interface IUser {
//   name: string;
//   email: string;
// }

// interface IEvent {
//   eventName: string;
// }

interface ITicket {
  userId: IUser | null;
  eventId: IEvent | null;
  price: number;
  createdAt: Date;
}
class TicketService implements ITicketService {

  constructor(private _ticketRepository: ITicketRepository,) { }


  async getTicketById(id: string): Promise<TicketDetails | null> {
    const ticket = await this._ticketRepository.findById(id);

    if (!ticket) return null;

    const event = ticket.eventId as unknown as IEvent;
    const user = ticket.userId as unknown as IUser;

    if (!event || !user) return null;

    const isValid = event.date ? new Date(event.date) >= new Date() : false;

    return {
      _id: ticket._id.toString(),
      eventName: event.eventName,
      location: event.location,
      image: event.image,
      date: event.date,
      time: event.time,
      userName: user.name,
      email: user.email,
      seats: ticket.seats,
      status: isValid ? "Valid" : "Expired",
      eventType: event.eventType,
      price: ticket.price,
    };
  }


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
  ): Promise<{
    users: {
      name: string;
      email: string;
      eventName: string;
      amount: number;
      createdAt: string;
    }[];
    totalPages: number;
    currentPage: number;
  }> {
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

    const users = (tickets as ITicket[])
      .filter(ticket => ticket.userId && ticket.eventId)
      .map(ticket => ({
        name: ticket.userId!.name,
        email: ticket.userId!.email,
        eventName: ticket.eventId!.eventName,
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
