import { EventGallery } from "../../models/EventGallery";

export interface IEventProfileRepository {
  getAllPrivateCreatorsProfile(): Promise<any>;
  findById(id: string): Promise<any>;
  getAllPost(creatorId: string): Promise<any>;
  create(data: EventGallery): Promise<any>;
  updateProfileField(field: string, value: any, creatorId: string): Promise<any>;
  getProfile(creatorId: string): Promise<any>;
}
