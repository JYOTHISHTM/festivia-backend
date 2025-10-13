import { IUser } from "../../models/User";
import { IBaseRepository } from "./IBaseRepository";
import { TicketDocument } from "../../models/Ticket";
import { WalletDocument } from "../../models/Wallet";
import { SeatLayoutDocument } from "../../models/SeatLayoutModel";
import { IEvent } from "../../models/Event";

export interface IUserRepository extends IBaseRepository<IUser> {
  blockUser(userId: string): Promise<IUser | null>;
  logout(userId: string): Promise<{ message: string }>;
  findByEmail(email: string): Promise<IUser | null>;
  countUsers(): Promise<number>;
  updateRefreshToken(id: string, refreshToken: string): Promise<IUser | null>;
  updateUserLocation(
    userId: string,
    location: string,
    latitude: number,
    longitude: number
  ): Promise<IUser | null>;
  getUserById(userId: string): Promise<IUser | null>;
  findTicketsByUserId(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    tickets: TicketDocument[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }>;
  findTicketById(ticketId: string): Promise<TicketDocument | null>;
  saveTicket(ticket: TicketDocument): Promise<TicketDocument>;
  findUserById(userId: string): Promise<IUser | null>;
  updateWalletBalance(userId: string, refundAmount: number): Promise<WalletDocument>;
  getSeatLayoutAndEvent(layoutId: string): Promise<{
    layout: SeatLayoutDocument;
    event: Pick<IEvent, "eventName" | "image">;
  }>;
  getUsersByIds(ids: string[]): Promise<IUser[]>;
}
