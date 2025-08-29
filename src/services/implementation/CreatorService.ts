import { ICreatorService } from "../interface/ICreatorService";
import { IEvent } from "../../models/Event";
import { ICreatorRepository } from "../../repositories/interface/ICreatorRepository";

class CreatorService implements ICreatorService {
  private _creatorRepository: ICreatorRepository;

  constructor(creatorRepository: ICreatorRepository) {
    this._creatorRepository = creatorRepository;
  }

  async getReservedEventsByCreator(layoutId: string) {
    return this._creatorRepository.findReservedEventsByCreator(layoutId);
  }

  async getCreator(creatorId: string): Promise<any> {
    return this._creatorRepository.findById(creatorId);
  }

  async createEvent(eventData: Partial<IEvent>) {
    const event = await this._creatorRepository.createEvent(eventData);
    return event;
  }
}

export default CreatorService;
