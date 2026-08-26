
import { ISubscription } from "../../models/Subscription";

export interface IAdminSubscriptionService {
  getSubscriptionPlan(): Promise<ISubscription[]>;
  createSubscription(subscriptionData: any): Promise<object>;
  deleteSubscription(id: string): Promise<ISubscription | null>;
}
