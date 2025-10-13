import { ICreatorSubscription } from "../../models/CreatorSubscription";

export interface ISubscriptionService {
  createCheckoutSession(creatorId: string, name: string): Promise<string>;

  buyUsingWallet(creatorId: string, planName: string):Promise<object>;

  fetchCreatorSubscription(creatorId: string):Promise<object>;

  getAllSubscriptionPlan(): Promise<ICreatorSubscription[] | null>;

  getCreatorHistory(creatorId: string, page?: number, limit?: number):Promise<object>;

  getSubscriptionHistory(page?: number, limit?: number):Promise<object>;

  saveSubscription(data: any):Promise<object>;

  expireSubscription(creatorId: string):Promise<object>;
}
