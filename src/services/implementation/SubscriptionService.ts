import { ICreatorSubscription } from '../../models/CreatorSubscription';
import Subscription from '../../models/Subscription';
import { ISubscriptionService } from '../interface/ISubscriptionService';
import { ISubscriptionRepository, ICreateSubscriptionData } from '../../repositories/interface/ISubscriptionRepository';
import { SubscriptionMessages } from '../../enums/StatusCodes';
import { IStripeService } from '../interface/IStripeService';


class SubscriptionService implements ISubscriptionService {

  constructor(
    private _subscriptionRepository: ISubscriptionRepository,
        private _stripeService: IStripeService

  ) { }

   async createCheckoutSession(creatorId: string, name: string): Promise<string> {
    const plan = await Subscription.findOne({ name });

    if (!plan) throw new Error(SubscriptionMessages.PLAN_INVALID);

    const successUrl = `${process.env.FRONTEND_URL}/creator/success`;
    const cancelUrl = `${process.env.FRONTEND_URL}/creator/cancel`;

    const metadata = {
      creatorId,
      planName: plan.name,
    };

    return await this._stripeService.createCheckoutSession(
      plan.price,
      successUrl,
      cancelUrl,
      metadata,
      plan.name
    );
  }


  async buyUsingWallet(creatorId: string, planName: string) {
    return await this._subscriptionRepository.buySubscriptionUsingWallet(creatorId, planName);
  }

  async fetchCreatorSubscription(creatorId: string) {
    return await this._subscriptionRepository.getSubscriptionByCreatorId(creatorId);
  }

  async getAllSubscriptionPlan(): Promise<ICreatorSubscription[] | null> {
    return await this._subscriptionRepository.getAllSubscriptionPlan();
  }

  async getCreatorHistory(creatorId: string, page: number = 1, limit: number = 5) {
    return await this._subscriptionRepository.getSubscriptionsByCreatorId(creatorId, page, limit);
  }

  async getSubscriptionHistory(page: number = 1, limit: number = 10) {
    return await this._subscriptionRepository.getSubscriptionsForAdmin(page, limit);
  }

  async saveSubscription(data: ICreateSubscriptionData) {
    return await this._subscriptionRepository.createSubscription(data);
  }

  async expireSubscription(creatorId: string) {
    return await this._subscriptionRepository.setSubscriptionExpired(creatorId);
  }
}


export default SubscriptionService