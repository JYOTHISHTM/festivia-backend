import { ICreatorSubscription } from "../../models/CreatorSubscription";

export interface ICreateSubscriptionData {
  creatorId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  [key: string]: unknown; // optional extra fields
}

export interface ISubscriptionRepository {
  buySubscriptionUsingWallet(
    creatorId: string,
    planName: string
  ): Promise<ICreatorSubscription>;

  saveCustomerSubscription(
    customerId: string,
    subscriptionId: string
  ): Promise<{ customerId: string; subscriptionId: string }>;

  getSubscriptionByCreatorId(
    creatorId: string
  ): Promise<ICreatorSubscription | null>;

  getAllSubscriptionPlan(): Promise<ICreatorSubscription[] | null>;

  getSubscriptionsByCreatorId(
    creatorId: string,
    page?: number,
    limit?: number
  ): Promise<{ subscriptions: ICreatorSubscription[]; total: number }>;

  getSubscriptionsForAdmin(
    page?: number,
    limit?: number
  ): Promise<{ subscriptions: ICreatorSubscription[]; totalCount: number }>;

  createSubscription(data: ICreateSubscriptionData): Promise<ICreatorSubscription>;

  setSubscriptionExpired(
    creatorId: string
  ): Promise<ICreatorSubscription | null>;
}
