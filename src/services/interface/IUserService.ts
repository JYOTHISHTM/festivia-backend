
import { IUser } from "../../models/User";
import { TicketDocument } from "../../models/Ticket";

export interface IUserService {
  // getTicketsByUserId(userId: string, page: number, limit: number): Promise<Response | null>;
  cancelTicketAndRefund(ticketId: string, userId: string): Promise<{ refundAmount: number }>;
  fetchLayoutAndEvent(layoutId: string):Promise<object>
  // getUserById(userId: string):Promise<object>

   getUserById(userId: string): Promise<IUser | null>;

  getTicketsByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    tickets: TicketDocument[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }>;
}
