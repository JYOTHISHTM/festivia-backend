import { Request, Response } from "express";
import { uploadToCloudinary } from "../../middleware/creator/ProfileImage";
import { StatusCodes } from "../../enums/StatusCodes";
import { IEventProfileController } from "../interface/IEventProfileController";
import { eventProfileDTO } from "../../dto/eventProfileDto";
import { IEventProfileService } from "../../services/interface/IEventProfileService";
import { PostEventMessages } from "../../enums/StatusCodes";


class EventProfileController implements IEventProfileController {

  constructor(private readonly _eventProfileService: IEventProfileService) { }


  async PostEvent(req: Request, res: Response): Promise<Response> {
    try {
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const mainImage = files["mainImage"]?.[0]?.path;
      if (!mainImage) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: PostEventMessages.MAIN_IMAGE_REQUIRED });
      }

      const additionalImages = (files["additionalImages"] || []).map(file => file.path);

      const totalTicketsSold = parseInt(req.body.totalTicketsSold) || 0;
      const totalRevenue = parseFloat(req.body.totalRevenue) || 0;

      const eventData = {
        ...req.body,
        totalTicketsSold,
        totalRevenue,
        creator: req.body.creator,
        mainImage,
        additionalImages,
      };


      const created = await this._eventProfileService.postEvent(eventData);


      return res.status(StatusCodes.CREATED).json(created);
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: PostEventMessages.EVENT_CREATION_FAILED });
    }
  }

  async getPostDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id: eventId } = req.params;
      const event = await this._eventProfileService.findByIdService(eventId);

      if (!event) {
        res.status(StatusCodes.NOT_FOUND).json({ error: PostEventMessages.EVENT_NOT_FOUND });
        return;
      }

      res.status(StatusCodes.OK).json(event);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: PostEventMessages.ERROR_FETCHING_EVENT_DETAILS });
    }
  }

  async getAllPost(req: Request, res: Response): Promise<void> {
    try {
      const creatorId = req.query.creatorId as string;

      if (!creatorId) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: PostEventMessages.MISSING_CREATOR_ID });
        return;
      }

      const events = await this._eventProfileService.getAllPost(creatorId);
      res.status(StatusCodes.OK).json(events);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: PostEventMessages.FAILED_TO_FETCH_EVENTS });
    }
  }

  async getAllPrivateCreatorsProfile(_req: Request, res: Response): Promise<void> {
    try {
      const profile = await this._eventProfileService.getAllPrivateCreatorsData();
      const safeProfiles = profile.map(eventProfileDTO);
      res.json(safeProfiles);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: PostEventMessages.ERROR_GETTING_PROFILE_INFO });
    }
  }

  async updateProfileImage(req: Request, res: Response): Promise<Response> {
    try {
      const file = req.file;
      const creatorId = req.body.creatorId;

      if (!file || !creatorId) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: PostEventMessages.MISSING_IMAGE_OR_ID });
      }

      const imageUrl = await uploadToCloudinary(file.buffer);
      const updated = await this._eventProfileService.updateProfile("profileImage", imageUrl, creatorId);

      return res.json(updated);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: PostEventMessages.FAILED_TO_UPDATE_PROFILE_IMAGE });
    }
  }

  async updateProfileInfo(req: Request, res: Response): Promise<void> {
    try {
      const { field, value } = req.body;

      if (!field || value === undefined) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: PostEventMessages.INVALID_PROFILE_UPDATE_DATA });
        return;
      }

      const creatorId = req.body.creator?.id;
      const updated = await this._eventProfileService.updateProfile(field, value, creatorId);

      res.json(updated);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: PostEventMessages.FAILED_TO_UPDATE_PROFILE_INFO });
    }
  }

  async getProfileInfo(req: Request, res: Response): Promise<void> {
    try {
      const creatorId = req.query.creatorId as string;

      if (!creatorId) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: PostEventMessages.CREATOR_ID_REQUIRED });
        return;
      }

      const profile = await this._eventProfileService.getProfileData(creatorId);

      if (!profile) {
        res.status(StatusCodes.NOT_FOUND).json({ error: PostEventMessages.PROFILE_NOT_FOUND });
        return;
      }

      res.json(profile);
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: PostEventMessages.FAILED_TO_UPDATE_PROFILE_INFO });
    }
  }
}

export default EventProfileController;
