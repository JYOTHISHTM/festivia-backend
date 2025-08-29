import { Request, Response } from "express";
import { StatusCodes } from "../../enums/StatusCodes";
import { IUser } from "../../models/User";
import { ICreator } from "../../models/Creator";
import { IProfileController } from "../interface/IProfileController";
import { IProfileService } from "../../services/interface/IProfileService";
import { Roles } from "../../enums/Roles";
import { ProfileMessages } from "../../enums/StatusCodes";



class ProfileController implements IProfileController {

  constructor(private readonly _profileService: IProfileService) { }


  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as Request & { user?: IUser; creator?: ICreator };

      let profileId = "";
      let profileType: Roles;

      if (authReq.user?.id) {
        profileId = authReq.user.id;
        profileType = Roles.USER;
      } else if (authReq.creator?.id) {
        profileId = authReq.creator.id;
        profileType = Roles.CREATOR;
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: ProfileMessages.PROFILE_NOT_FOUND });
        return;
      }


      const updatedProfile = await this._profileService.updateProfile(profileType, profileId, req.body);

      if (!updatedProfile) {
        res.status(StatusCodes.NOT_FOUND).json({ message: `${profileType} ${ProfileMessages.USER_NOT_FOUND}` });
        return;
      }

      res.json(updatedProfile);
    } catch (err) {
      const error = err as Error

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ProfileMessages.SERVER_ERROR, error: error.message });
    }
  }

async getProfile(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as Request & { user?: IUser; creator?: ICreator };

    const creatorId = authReq.creator?.id;
    const userId = authReq.user?.id;

    if (!creatorId && !userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: ProfileMessages.UNAUTHORIZED });
      return;
    }

    const type: Roles = creatorId ? Roles.CREATOR : Roles.USER;
    const id = creatorId || userId;

    const profile = await this._profileService.getProfileById(id, type);

    if (!profile) {
      const notFoundMsg =
        type === Roles.CREATOR
          ? ProfileMessages.CREATOR_NOT_FOUND
          : ProfileMessages.USER_NOT_FOUND;

      res.status(StatusCodes.NOT_FOUND).json({ message: notFoundMsg });
      return;
    }

    res.json(profile);
  } catch (err) {
    const error = err as Error;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: ProfileMessages.FETCH_ERROR,
      error: error.message,
    });
  }
}

}

export default ProfileController;
