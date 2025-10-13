import { ITicket,TicketDocument } from "../../models/Ticket";

export interface ITicketRepository {
  getTicketSummaryByCreator(
    creatorId: string,
    selectedEventId?: string,
    page?: number,
    limit?: number
  ):Promise<object>
  createTicket(ticketData: Partial<ITicket>): Promise<ITicket>;
  markSeatAsBooked(seatLayoutId: string, seatNumber: string):Promise<object>
  getUsersWhoBoughtTicketsByCreator(
    creatorId: string,
    skip: number,
    limit: number
  ): Promise<{ tickets: any[]; totalCount: number }>;
    findById(id: string): Promise<TicketDocument | null>;

}
