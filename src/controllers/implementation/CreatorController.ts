import { Request, Response } from "express";
import { ICreatorController } from "../interface/ICreatorController";
import { ICreatorService } from "../../services/interface/ICreatorService";
import { StatusCodes } from "../../enums/StatusCodes";
import { CreatorMessages } from "../../enums/StatusCodes";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import { validateAndMarkLayout } from "../../utils/validateLayout";
import { parseGeoLocation } from "../../utils/parseGeoLocation";

type CreatorRequest = Request & {
  creator?: {
    id: string;
  };
};


class CreatorController implements ICreatorController {

  constructor(private readonly _creatorService: ICreatorService) { }


  async getReservedEvents(req: Request, res: Response) {
    try {
      const { layoutId } = req.params;
      const { creatorId } = req.query;

      if (!creatorId) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: CreatorMessages.MISSING_CREATOR_ID });
      }

      const events = await this._creatorService.getReservedEventsByCreator(layoutId);
      return res.status(StatusCodes.OK).json(events);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: CreatorMessages.FAILED_TO_FETCH_EVENTS, error: error instanceof Error ? error.message : error });
    }
  }



  async getCreator(req: CreatorRequest , res: Response): Promise<Response> {
    try {

      const creatorId = req.creator?.id;
      if (!creatorId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: CreatorMessages.UNAUTHORIZED });
      }

      const creator = await this._creatorService.getCreator(creatorId);
      if (!creator) return res.sendStatus(404);

      return res.json(creator);
    } catch (err) {
            const error=err as Error

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: CreatorMessages.SERVER_ERROR });
    }
  }

  async createEvent(req: CreatorRequest , res: Response) {
    try {
      if (!req.file) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: CreatorMessages.IMAGE_REQUIRED });
      }

      const imageUpload = await uploadToCloudinary(req.file.buffer, "festivia/events");
      const imageUrl = imageUpload.secure_url;

      const {
        eventName, eventType, description, date, startDate, endDate,
        daySelectionMode, time, location, seatType, price, layoutId, geoLocation: geoStr
      } = req.body;

      const geoLocation = parseGeoLocation(geoStr);

      if (!eventName || !eventType || !description || !daySelectionMode || !time || !location || !seatType) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: CreatorMessages.REQUIRED_FIELDS_MISSING });
      }

      if (seatType === "GENERAL" && (!price || isNaN(parseFloat(price)))) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid or missing price" });
      }

      if (daySelectionMode === "single" && !date) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Date is required for single day mode" });
      }

      if (daySelectionMode === "range" && (!startDate || !endDate)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Start and end dates required" });
      }

      const creatorId = req.creator?.id;
      if (!creatorId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
      }

      const eventData: any = {
        eventName, eventType, description, daySelectionMode, time, location, seatType,
        image: imageUrl, creatorId, geoLocation,
        ...(seatType === "GENERAL" && { price: parseFloat(price) }),
        ...(daySelectionMode === "single" && { date }),
        ...(daySelectionMode === "range" && { startDate, endDate })
      };

      if (seatType === "RESERVED") {
        const layoutIdValue = Array.isArray(layoutId) ? layoutId.find(id => id.trim()) : layoutId;
        eventData.layoutId = await validateAndMarkLayout(layoutIdValue);
      }

      const newEvent = await this._creatorService.createEvent(eventData);
      return res.status(StatusCodes.CREATED).json(newEvent);
    } catch (err) {
      const error = err as Error

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed to create event", error: error.message });
    }
  }


}

export default CreatorController;



