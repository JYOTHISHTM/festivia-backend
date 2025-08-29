import { IEventProfileService } from "../interface/IEventProfileService";
import { EventGallery } from "../../models/EventGallery";
import { IEventProfileRepository } from "../../repositories/interface/IEventProfileRepository";

 class EventProfileService implements IEventProfileService {

  constructor(private _eventProfileRepository: IEventProfileRepository) { }


  async getAllPrivateCreatorsData(): Promise<any> {
    return this._eventProfileRepository.getAllPrivateCreatorsProfile();
  }

  

  async getAllPost(creatorId: string): Promise<any> {
    return this._eventProfileRepository.getAllPost(creatorId);
  }

  async postEvent(data: EventGallery): Promise<any> {
    return this._eventProfileRepository.create(data);
  }

  async findByIdService(id: string): Promise<any> {
    return this._eventProfileRepository.findById(id);
  }

  async updateProfile(field: string, value: any, creatorId: string): Promise<any> {
    return this._eventProfileRepository.updateProfileField(field, value, creatorId);
  }

  async getProfileData(creatorId: string): Promise<any> {
    return this._eventProfileRepository.getProfile(creatorId);
  }
}
 
export default EventProfileService

