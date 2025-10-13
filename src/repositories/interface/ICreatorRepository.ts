import { ICreator } from "../../models/Creator";
import { IEvent } from "../../models/Event";
import { IBaseRepository } from "./IBaseRepository";
import { SeatLayoutDocument } from "../../models/SeatLayoutModel";

export interface ICreatorRepository extends IBaseRepository<ICreator> {
  blockCreator(creatorId: string): Promise<ICreator | null>;
  createEvent(eventData: Partial<IEvent>): Promise<IEvent>;
  findByEmail(email: string): Promise<ICreator | null>
  updateRefreshToken(id: unknown, refreshToken: string): Promise<void>;
  clearRefreshToken(id: string): Promise<void>;
  findByRefreshToken(refreshToken: string): Promise<ICreator | null>;
  clearRefreshToken(creatorId: string): Promise<void>;
  findById(creatorId: string): Promise<ICreator | null>;
  findPendingCreators(): Promise<ICreator[]>
  approveCreator(creatorId: string): Promise<ICreator | null>
  rejectCreator(creatorId: string, rejectionReason: string): Promise<ICreator | null>
  getCreatorStatus(creatorId: string): Promise<ICreator | null>
  countCreators(): Promise<number>
  countPendings(): Promise<number>
  findReservedEventsByCreator(layoutId: string): Promise<{
    layout: SeatLayoutDocument;
    event: Pick<IEvent, 'eventName' | 'image'>;
  }>;
}
