import { ITicket } from "../../models/Ticket";

export interface ITicketRepository {
  getTicketSummaryByCreator(
    creatorId: string,
    selectedEventId?: string,
    page?: number,
    limit?: number
  ): Promise<any>;
  createTicket(ticketData: Partial<ITicket>): Promise<ITicket>;
  markSeatAsBooked(seatLayoutId: string, seatNumber: string): Promise<any>;
  getUsersWhoBoughtTicketsByCreator(
    creatorId: string,
    skip: number,
    limit: number
  ): Promise<{ tickets: any[]; totalCount: number }>;

}
