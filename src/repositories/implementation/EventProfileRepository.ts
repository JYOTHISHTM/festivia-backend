import EventProfileModel from "../../models/EventProfile";
import EventGalleryModel, { EventGallery } from "../../models/EventGallery";

class EventProfileRepository {
  async getAllPrivateCreatorsProfile() {
    return await EventProfileModel.find();
  }

  async findById(id: string) {
    return await EventGalleryModel.findById(id);
  }

  async getAllPost(creatorId: string) {
    return await EventGalleryModel.find({ creator: creatorId });
  }

  async create(data: EventGallery) {
    const event = new EventGalleryModel(data);
    return await event.save();
  }

  async updateProfileField(field: string, value: any, creatorId: string) {
    const update = { [field]: value, creator: creatorId };
    return await EventProfileModel.findOneAndUpdate(
      { creator: creatorId },
      update,
      { new: true, upsert: true }
    );
  }

  async getProfile(creatorId: string) {
    return await EventProfileModel.findOne({ creator: creatorId });
  }
}

export default  EventProfileRepository
