
export interface ITicketService {
  getTicketSummary( creatorId: string, selectedEventId?: string, page?: number, limit?: number): Promise<any>; 
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

}
