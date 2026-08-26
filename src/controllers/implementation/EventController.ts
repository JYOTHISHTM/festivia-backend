import { Request, Response } from "express";
import { IEventController } from '../interface/IEventController'
import { IEventService } from '../../services/interface/IEventService'
import { StatusCodes } from "../../enums/StatusCodes";
import { eventDTO } from "../../dto/eventDto";
import { homeEventDTO } from "../../dto/homeEvent";
import { EventMessages } from "../../enums/StatusCodes";


class EventController implements IEventController {

  constructor(private readonly _eventService: IEventService) { }

  async getHomeEvents(req: Request, res: Response): Promise<void> {
    console.log('reached controller');
    try {
      const events = await this._eventService.getHomeEvents();
      const mappedEvents = Array.isArray(events) ? events.map(homeEventDTO) : [];
      res.status(StatusCodes.OK).json(mappedEvents);
    } catch {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: EventMessages.ERROR_FETCHING_HOME_EVENTS });
    }
  }


  async getAllListedEvents(req: Request, res: Response): Promise<void> {
    console.log('reched');
    
    try {
      const { creatorId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = 6;

      if (!creatorId) {
        res.status(StatusCodes.BAD_REQUEST).json({ message:EventMessages.MISSING_CREATOR_ID });
        return;
      }

      const events = await this._eventService.getAllListedEvents(creatorId, page, limit);
      const mappedEvents = events.map(eventDTO);
      res.json(mappedEvents);

    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: EventMessages.ERROR_FETCHING_EVENTS });
    }
  }
  async getEventById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const event = await this._eventService.getEventById(id);

      if (!event) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: EventMessages.EVENT_NOT_FOUND });
      }

      return res.json(event);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: EventMessages.ERROR_FETCHING_EVENTS });
    }
  }


  async getAllEvents(req: Request, res: Response): Promise<Response> {
    try {
      const { search, eventType, minPrice, maxPrice, page = 1, limit = 9 } = req.query;

      const filters: any = {};

      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 9;
      const skip = (pageNum - 1) * limitNum;

      if (search) {
        filters.eventName = { $regex: search, $options: 'i' };
      }

      if (eventType) {
        filters.eventType = eventType;
      }

      if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) filters.price.$gte = Number(minPrice);
        if (maxPrice) filters.price.$lte = Number(maxPrice);
      }


      if (req.query.location) {
        filters.location = { $regex: req.query.location as string, $options: 'i' };
      }


      const [events, total] = await Promise.all([
        this._eventService.getAllEvents(filters, skip, limitNum),
        this._eventService.countEvents(filters)
      ]);


      return res.status(StatusCodes.OK).json({
        events,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum)
      });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: EventMessages.FAILED_TO_FETCH_EVENTS});
    }
  }


  async getEventType(req: Request, res: Response): Promise<Response> {
    try {
      const eventType = await this._eventService.getEventType();
      return res.status(StatusCodes.OK).json(eventType);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: EventMessages.FAILED_TO_FETCH_EVENT_TYPES });
    }
  }

  async toggleListStatus(req: Request, res: Response): Promise<void> {
    try {
      const { eventId } = req.params;
      const updatedEvent = await this._eventService.toggleEventListing(eventId);
      res.status(StatusCodes.OK).json({ message: EventMessages.LISTING_STATUS_UPDATED, event: updatedEvent });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: EventMessages.FAILED_TO_UPDATE_LISTING_STATUS});
    }
  };

 async bookEvent(req: Request, res: Response) {
    try {
      const { eventId } = req.body;
      const { userId } = req.params;
      const sessionUrl = await this._eventService.bookTicket(userId, eventId);
      res.status(StatusCodes.OK).json({ sessionUrl });
    } catch (err) {
            const error=err as Error

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }


  async updateDescription(req: Request, res: Response) {
    const eventId = req.params.id;
    const { description } = req.body;

    try {
      const updatedEvent = await this._eventService.updateDescription(eventId, description);
      res.status(StatusCodes.OK).json(updatedEvent);
    } catch (err) {
            const error=err as Error

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: EventMessages.FAILED_TO_UPDATE_DESCRIPTION, error: error.message });
    }
  }

  async updateLocation(req: Request, res: Response) {
const userId = (req.user as { id: string }).id;
    const { location, latitude, longitude } = req.body;

    const user = await this._eventService.updateLocation(userId as string, location, latitude, longitude);
    res.json(user);
  };


  async getEventsNearUser(req: Request, res: Response) {
    console.log('reached');
    
const userId = (req.user as { id: string }).id;
    const user = await this._eventService.getUser(userId as string);

    if (!user?.geoLocation?.coordinates?.length) {
      return res.status(StatusCodes.OK).json({ message: EventMessages.NO_LOCATION });
    }

    const [longitude, latitude] = user.geoLocation.coordinates;

    const events = await this._eventService.fetchEventsForUserLocation(latitude, longitude);

    if (events.length === 0) {
      return res.status(StatusCodes.OK).json({ message: EventMessages.NO_EVENTS, location: user.location });
    }

    res.json({ location: user.location, events });
  };


}

export default EventController;
