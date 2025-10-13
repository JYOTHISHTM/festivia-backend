import { EventGallery } from "../../models/EventGallery";

export interface IEventProfileRepository {
  getAllPrivateCreatorsProfile(): Promise<Response>;
  findById(id: string): Promise<Response>;
  getAllPost(creatorId: string): Promise<Response>;
  create(data: EventGallery): Promise<Response>;
  updateProfileField(field: string, value: Response, creatorId: string): Promise<Response>;
  getProfile(creatorId: string): Promise<Response>;
}
