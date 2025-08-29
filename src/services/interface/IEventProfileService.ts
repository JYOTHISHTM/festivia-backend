import { EventGallery } from "../../models/EventGallery";

export interface IEventProfileService {
  getAllPrivateCreatorsData(): Promise<any>;
  getAllPost(creatorId: string): Promise<any>;
  postEvent(data: EventGallery): Promise<any>;
  findByIdService(id: string): Promise<any>;
  updateProfile(field: string, value: any, creatorId: string): Promise<any>;
  getProfileData(creatorId: string): Promise<any>;
}
