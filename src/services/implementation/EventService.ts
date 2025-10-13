import { IEventService } from '../interface/IEventService'
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { IEventRepository } from "../../repositories/interface/IEventRepository";
import { PaymentUtil } from "../../utils/paymentUtil";
import { EventMessages } from "../../enums/StatusCodes";
import { ITicketRepository } from '../../repositories/interface/ITicketRepository';
import { Types } from "mongoose";



class EventService implements IEventService {

  constructor(
    private _userRepository: IUserRepository,
    private _eventRepository: IEventRepository,
    private _ticketRepository: ITicketRepository
  ) { }

  async updateLocation(userId: string, location: string, latitude: number, longitude: number):Promise<object|null> {
    return await this._userRepository.updateUserLocation(userId, location, latitude, longitude);
  }


  async getUser(userId: string):Promise<object|null> {
    return await this._userRepository.getUserById(userId);
  };


  async fetchEventsForUserLocation(latitude: number, longitude: number):Promise<object|null> {
    return await this._eventRepository.getEventsByLocation(latitude, longitude);
  }


  async bookTicket(userId: string, eventId: string):Promise<string|null> {
    const event = await this._eventRepository.getEventByIdForTicket(eventId);
    const user = await this._userRepository.findById(userId);

    if (!event) throw new Error(EventMessages.EVENT_NOT_FOUND);
    if (!user) throw new Error(EventMessages.USER_NOT_FOUND);

    const sessionUrl = await PaymentUtil.createStripeCheckoutSession(event, user);

    await this._ticketRepository.createTicket({
      userId: new Types.ObjectId(userId),
      eventId: new Types.ObjectId(eventId),
      price: event.price,
      seats: [],
      paymentStatus: "pending",
    });

    return sessionUrl;
  }

  async updateDescription(eventId: string, description: string) {
    return await this._eventRepository.updateDescription(eventId, description);
  }

  async getHomeEvents() {
    try {
      return await this._eventRepository.getHomeEvents();
    } catch (error) {
      throw new Error('Error fetching home events');
    }
  }

  async getAllListedEvents(creatorId: string, page: number, limit: number) {
    try {
      return await this._eventRepository.getAllListedEvents(creatorId, page, limit);
    } catch (error) {
      throw new Error('Error fetching home events');
    }
  }


  async getEventById(id: string):Promise<object|null> {
    const event = await this._eventRepository.getEventById(id);
    return event;
  }


  async getAllEvents(filters: any, skip: number, limit: number) {
    return await this._eventRepository.getAllEvents(filters, skip, limit);
  }

  async countEvents(filters: any):Promise<number> {
    return await this._eventRepository.countEvents(filters);
  }



  async getEventType() {
    return await this._eventRepository.getEventType();
  }

  async toggleEventListing(eventId: string) {
    return await this._eventRepository.toggleListingStatus(eventId);
  };


}

export default EventService
