import { TicketDetails } from "../../dto/TicketDetails";

export interface ITicketService {
  getTicketSummary( creatorId: string, selectedEventId?: string, page?: number, limit?: number):Promise<object> 


  getUsersWhoBoughtTickets(
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
}>;
 getTicketById(id: string): Promise<TicketDetails | null>;


}
