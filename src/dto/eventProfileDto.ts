import { IEventProfile } from "../models/EventProfile"; 

export const eventProfileDTO = (profile: IEventProfile) => ({
  _id: profile._id,
  creator: profile.creator,
  profileName: profile.profileName,
  profileImage: profile.profileImage,
  profileBio: profile.profileBio,
  eventCount: profile.eventCount,
  eventTypes: profile.eventTypes
});
