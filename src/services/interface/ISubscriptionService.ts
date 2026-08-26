import { ICreatorSubscription } from "../../models/CreatorSubscription";
// import the correct subscription/history interfaces from your project

interface ICreatorHistoryResponse {
  subscriptions: ICreatorSubscription[];
  total: number;
}

interface ISubscriptionHistoryResponse {
  subscriptions: ICreatorSubscription[];
  totalCount: number;
}

export interface ISubscriptionService {

  fetchCreatorSubscription(
    creatorId: string
  ): Promise<ICreatorSubscription | null>;

  createCheckoutSession(
    creatorId: string,
    name: string
  ): Promise<string>;

  buyUsingWallet(
    creatorId: string,
    planName: string
  ): Promise<ICreatorSubscription>;

  getAllSubscriptionPlan(): Promise<ICreatorSubscription[] | null>;

  getCreatorHistory(
    creatorId: string,
    page: number,
    limit: number
  ): Promise<ICreatorHistoryResponse>;

  getSubscriptionHistory(
    page: number,
    limit: number
  ): Promise<ISubscriptionHistoryResponse>;

  expireSubscription(
    creatorId: string
  ): Promise<ICreatorSubscription | null | void>;
}