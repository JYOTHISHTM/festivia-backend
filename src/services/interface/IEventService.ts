import { IEvent } from "../../models/Event";
import { IUser } from "../../models/User";

export interface IEventService {
  updateDescription(
    eventId: string,
    description: string
  ): Promise<IEvent | null>;

  bookTicket(
    userId: string,
    eventId: string
  ): Promise<string | null>;

  toggleEventListing(
    eventId: string
  ): Promise<IEvent | null>;

  getEventType(): Promise<string[]>;

  countEvents(
    filters: any
  ): Promise<number>;

  getHomeEvents(): Promise<IEvent[]>;

  getEventById(
    id: string
  ): Promise<IEvent | null>;

  getUser(
    userId: string
  ): Promise<IUser | null>;

  getAllEvents(
    filters: any,
    skip: number,
    limit: number
  ): Promise<IEvent[]>;

  fetchEventsForUserLocation(
    latitude: number,
    longitude: number
  ): Promise<IEvent[]>;

  updateLocation(
    userId: string,
    location: string,
    latitude: number,
    longitude: number
  ): Promise<IUser | null>;

  getAllListedEvents(
    creatorId: string,
    page: number,
    limit: number
  ): Promise<IEvent[]>;
}