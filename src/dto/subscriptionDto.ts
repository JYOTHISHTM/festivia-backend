import { ICreatorSubscription } from "../models/CreatorSubscription"; 

export const CreatorSubscriptionDTO = (subscription: ICreatorSubscription) => ({
  _id: subscription._id,
  name: subscription.name,
  price: subscription.price,
  days: subscription.days,
  subscribedAt: subscription.subscribedAt,
  status: subscription.status
});


export interface CreateSubscriptionDTO {
  name: string;
  price: number;
  days: number;
}