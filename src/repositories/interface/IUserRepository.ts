import { IUser } from "../../models/User";
import { IBaseRepository } from "./IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser> {
  blockUser(userId: string): Promise<IUser | null>;
  logout(userId: string): Promise<{ message: string }>;
  findByEmail(email: string): Promise<IUser | null>;
  countUsers(): Promise<number>;
  updateRefreshToken(id: unknown, refreshToken: string): Promise<any>;
  updateUserLocation(userId: string, location: string, latitude: number, longitude: number): Promise<any>
  getUserById(userId: string): Promise<IUser | null>
  findTicketsByUserId(userId: string, page: number, limit: number): Promise<any>
  findTicketById(ticketId: string): Promise<any>
  saveTicket(ticket: any): Promise<any>
  findUserById(userId: string): Promise<any>
  updateWalletBalance(userId: string, refundAmount: number): Promise<any>
  getSeatLayoutAndEvent(layoutId: string): Promise<any>
  getUsersByIds(ids: string[]): Promise<IUser[]>

}
