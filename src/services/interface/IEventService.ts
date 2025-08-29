
import { IEvent } from '../../models/Event';

export interface IEventService {
    updateDescription(eventId:string,description:string): Promise<IEvent | null>;
    bookTicket(userId:string,eventId:string): Promise<any>;
    toggleEventListing(eventId:string): Promise<any>;
    getEventType(): Promise<any>;
    countEvents(filters:string): Promise<any>;
    getHomeEvents(): Promise<any>;
    getEventById(id: string): Promise<any>;
    getUser(userId: string): Promise<any>;
    getAllEvents(filters: any, skip: number, limit: number): Promise<any>;
    fetchEventsForUserLocation(latitude: number, longitude: number): Promise<any>;
    updateLocation(userId: string, location: string, latitude: number,longitude:number): Promise<any>;
    getAllListedEvents(creatorId: string, page: number, limit: number): Promise<any>;
  }
   