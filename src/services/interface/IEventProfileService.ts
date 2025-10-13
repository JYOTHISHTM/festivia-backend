import { EventGallery } from "../../models/EventGallery";

export interface IEventProfileService {
  getAllPrivateCreatorsData(): Promise<object>
  getAllPost(creatorId: string): Promise<object>
  postEvent(data: EventGallery): Promise<object>
  findByIdService(id: string): Promise<object>
  updateProfile(field: string, value: String, creatorId: string): Promise<object>
  getProfileData(creatorId: string): Promise<object>
}
