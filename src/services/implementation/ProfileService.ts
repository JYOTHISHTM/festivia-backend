import { IUser } from "../../models/User";
import { ICreator } from "../../models/Creator";
import { IProfileService } from "../interface/IProfileService";
import { IProfileRepository } from "../../repositories/interface/IProfileRepository";
import { Roles } from "../../enums/Roles";


class ProfileService implements IProfileService {


  constructor(private _profileRepository: IProfileRepository) { }


  public async updateProfile(
    profileType: Roles,
    profileId: string,
    profileData: Partial<IUser | ICreator>
  ): Promise<IUser | ICreator | null> {
    return await this._profileRepository.updateProfile(profileType, profileId, profileData);
  }

  public async getProfileById(
    id: string,
    type: Roles
  ): Promise<ICreator | IUser | null> {
    return await this._profileRepository.findById(id, type);
  }
}

export default ProfileService
