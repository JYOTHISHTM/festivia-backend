
import dotenv from "dotenv";
import { IUserService } from "../interface/IUserService";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { TicketMessages } from "../../enums/StatusCodes";

dotenv.config();

class UserService implements IUserService {

  constructor(private _userRepository: IUserRepository) {

  }

  async getUserById(userId: string) {
    return this._userRepository.findUserById(userId); 
  }
  async getTicketsByUserId(userId: string, page: number, limit: number) {
    return await this._userRepository.findTicketsByUserId(userId, page, limit);
  }


  async cancelTicketAndRefund(ticketId: string, userId: string) {
    const ticket = await this._userRepository.findTicketById(ticketId)

    if (!ticket) throw new Error(TicketMessages.TICKET_NOT_FOUND);

    if (ticket.userId.toString() !== userId) {
      throw new Error(TicketMessages.UNAUTHORIZED_TICKET);
    }

    const event = ticket.eventId as { date: Date; price: number };

    const eventDate = new Date(event.date);
    const now = new Date();
    const diffInDays = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    if (diffInDays < 2) {
      throw new Error(TicketMessages.EVENT_TOO_CLOSE_TO_CANCEL);
    }

    if (ticket.paymentStatus === TicketMessages.CANCELLED) {
      throw new Error(TicketMessages.TICKET_ALREADY_CANCELLED);
    }

    ticket.paymentStatus = TicketMessages.CANCELLED;
    await this._userRepository.saveTicket(ticket);

    const user = await this._userRepository.findUserById(userId);
    if (!user) throw new Error(TicketMessages.USER_NOT_FOUND);

    const refundAmount = event.price / 2;
    await this._userRepository.updateWalletBalance(userId, refundAmount);

    return { refundAmount };
  }


  async fetchLayoutAndEvent(layoutId: string) {
    return await this._userRepository.getSeatLayoutAndEvent(layoutId);
  }


}

export default UserService



