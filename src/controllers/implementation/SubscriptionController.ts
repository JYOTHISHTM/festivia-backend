import { Request, Response } from 'express';
import { ISubscriptionController } from '../interface/ISubscriptionController';
import { StatusCodes } from "../../enums/StatusCodes";
import { CreatorSubscriptionDTO } from '../../dto/subscriptionDto';
import { ISubscriptionService } from '../../services/interface/ISubscriptionService';
import { SubscriptionMessages } from '../../enums/StatusCodes';


type CreatorRequest = Request & {
  creator?: {
    id: string;
  };
};


class SubscriptionController implements ISubscriptionController {

  constructor(private readonly _subscriptionService: ISubscriptionService) { }

  async getCreatorSubscription(req: CreatorRequest, res: Response): Promise<void> {
    try {
      const creatorId = req.creator?.id;

      if (!creatorId) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: SubscriptionMessages.CREATOR_ID_MISSING });
        return;
      }

      const subscription = await this._subscriptionService.fetchCreatorSubscription(creatorId);

      const subscriptionDto = subscription
        ? CreatorSubscriptionDTO(subscription)
        : null;

      res.status(StatusCodes.OK).json(subscriptionDto);
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: SubscriptionMessages.FETCH_SUBSCRIPTION_ERROR });
    }
  }


  async createSubscriptionCheckout(req: Request, res: Response): Promise<void> {
    try {
      const { creatorId, name } = req.body;
      const checkoutUrl = await this._subscriptionService.createCheckoutSession(creatorId, name);
      res.status(StatusCodes.OK).json({ url: checkoutUrl });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: SubscriptionMessages.STRIPE_ERROR });
    }
  }

  async buyUsingWallet(req: Request, res: Response): Promise<void> {
    try {
      const { creatorId, planName } = req.body;
      const subscription = await this._subscriptionService.buyUsingWallet(creatorId, planName);
      res.status(StatusCodes.OK).json({
        message: SubscriptionMessages.PURCHASED,
        subscription
      });
    } catch (err) {
      const error = err as Error;
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }



  async getAllSubscriptionPlan(req: Request, res: Response): Promise<Response> {
    try {
      const plans = await this._subscriptionService.getAllSubscriptionPlan();
      return res.status(StatusCodes.OK).json(plans);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: SubscriptionMessages.FETCH_SUBSCRIPTION_PLANS_ERROR });
    }
  }

  async getCreatorHistory(req: CreatorRequest, res: Response): Promise<void> {
    try {
      const creatorId = req.creator?.id;
      if (!creatorId) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: SubscriptionMessages.CREATOR_ID_MISSING });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = 5;

      const { subscriptions, total } = await this._subscriptionService.getCreatorHistory(creatorId, page, limit);

      res.status(StatusCodes.OK).json({
        success: true,
        history: subscriptions,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: SubscriptionMessages.FETCH_HISTORY_ERROR
      });
    }
  }

  async getSubscriptionHistory(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { subscriptions, totalCount } = await this._subscriptionService.getSubscriptionHistory(page, limit);

      res.status(StatusCodes.OK).json({
        success: true,
        history: subscriptions,
        totalCount,
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: SubscriptionMessages.FETCH_HISTORY_ERROR });
    }
  }

  async expireSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { creatorId } = req.params;
      await this._subscriptionService.expireSubscription(creatorId);
      res.status(StatusCodes.OK).json({ message: SubscriptionMessages.EXPIRE_SUBSCRIPTION_ERROR });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: SubscriptionMessages.FETCH_ERROR });
    }
  }
}


export default SubscriptionController