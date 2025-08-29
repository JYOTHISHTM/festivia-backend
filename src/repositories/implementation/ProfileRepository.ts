import UserModel, { IUser } from "../../models/User";
import CreatorModel, { ICreator } from "../../models/Creator";
import { UpdateQuery } from "mongoose";
import { IProfileRepository } from "../interface/IProfileRepository";
import { ICreatorRepository } from "../interface/ICreatorRepository";
import { IUserRepository } from "../interface/IUserRepository";


class ProfileRepository implements IProfileRepository{

    constructor(
      private readonly _creatorRepository: ICreatorRepository,
      private readonly _userRepository: IUserRepository
    ) {}
  

  public async updateProfile(
    profileType: "user" | "creator",
    profileId: string,
    updatedData: UpdateQuery<IUser | ICreator>
  ): Promise<IUser | ICreator | null> {
    try {
      let result = null;

      if (profileType === "user") {
        result = await UserModel.findByIdAndUpdate(profileId, updatedData, {
          new: true,
          runValidators: true,
        });
      } else if (profileType === "creator") {
        result = await CreatorModel.findByIdAndUpdate(profileId, updatedData, {
          new: true,
          runValidators: true,
        });
      }


      return result;
    } catch (err) {
      const error=err as Error
      throw error;
    }
  }

  public async findById(id: string, type: "creator" | "user"): Promise<ICreator | IUser | null> {
    return type === "creator" ? await this._creatorRepository.findById(id) : await this._userRepository.findById(id);
  }

}

export default  ProfileRepository
