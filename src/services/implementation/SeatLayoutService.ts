import { ISeatLayout, SeatLayoutDocument } from '../../models/SeatLayoutModel';
import SeatLayoutModel from '../../models/SeatLayoutModel';
import { ISeatLayoutService } from '../interface/ISeatLayoutService';
import { ISeatLayoutRepository } from '../../repositories/interface/ISeatLayoutRepository';

 class SeatLayoutService implements ISeatLayoutService {

  constructor(private _seatLayoutRepository: ISeatLayoutRepository) { }

  async createLayout(data: Omit<ISeatLayout, 'createdAt'>): Promise<SeatLayoutDocument> {
    const newLayout: ISeatLayout = {
      ...data,
      createdAt: new Date(),
      isUsed: false,
    };
    return this._seatLayoutRepository.save(newLayout);
  }

  async getAllLayouts(): Promise<SeatLayoutDocument[]> {
    return this._seatLayoutRepository.findAll();
  }

  async getLayoutsByCreatorId(creatorId: string): Promise<SeatLayoutDocument[]> {
    return await SeatLayoutModel.find({ creatorId, isUsed: false });
  }
}

export default SeatLayoutService
