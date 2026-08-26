import { EventGallery } from "../../models/EventGallery";
import { IEventProfile } from "../../models/EventProfile";

export interface IEventProfileRepository {
  getAllPrivateCreatorsProfile(): Promise<IEventProfile[]>;
  findById(id: string): Promise<EventGallery | null>;
  getAllPost(creatorId: string): Promise<EventGallery[]>;
  create(data: EventGallery): Promise<EventGallery>;
  updateProfileField(field: string, value: any, creatorId: string): Promise<IEventProfile | null>;
  getProfile(creatorId: string): Promise<IEventProfile | null>;
}
