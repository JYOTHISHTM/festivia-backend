
import { IEvent } from '../../models/Event';

export interface IEventService {
    updateDescription(eventId:string,description:string): Promise<IEvent | null>;
    bookTicket(userId:string,eventId:string):Promise<string|null>;
    toggleEventListing(eventId:string):Promise<object>;
    getEventType():Promise<object>;
    countEvents(filters:string):Promise<number>;
    getHomeEvents():Promise<object>;
    getEventById(id: string):Promise<object|null>;
    getUser(userId: string):Promise<object|null>;
    getAllEvents(filters: any, skip: number, limit: number):Promise<object>;
    fetchEventsForUserLocation(latitude: number, longitude: number):Promise<object|null>;
    updateLocation(userId: string, location: string, latitude: number,longitude:number):Promise<object|null>;
    getAllListedEvents(creatorId: string, page: number, limit: number):Promise<object>;
  }
   


