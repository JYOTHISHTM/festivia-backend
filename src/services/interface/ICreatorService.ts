import { IEvent } from "../../models/Event";

export interface ICreatorService {
  createEvent(eventData: Partial<IEvent>): Promise<IEvent>;
  getCreator(creatorId: string):Promise<object|null>
  getReservedEventsByCreator(creatorId: string):Promise<object>
}
