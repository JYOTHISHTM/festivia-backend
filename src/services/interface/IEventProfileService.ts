import { EventGallery } from "../../models/EventGallery";
import { IEventProfile } from "../../models/EventProfile";

export interface IEventProfileService {
  getAllPrivateCreatorsData(): Promise<IEventProfile[]>;
  getAllPost(creatorId: string): Promise<EventGallery[]>;
  postEvent(data: EventGallery): Promise<EventGallery>;
  findByIdService(id: string): Promise<EventGallery | null>;
  updateProfile(field: string, value: any, creatorId: string): Promise<IEventProfile | null>;
  getProfileData(creatorId: string): Promise<IEventProfile | null>;
}
