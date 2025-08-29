import { Request, Response } from "express";
import { StatusCodes, Messages } from "../../enums/StatusCodes";
import { IAdminSubscriptionController } from "../interface/IAdminSubscriptionController";
import { IAdminSubscriptionService } from '../../services/interface/IAdminSubscriptionService'



class AdminSubscriptionController implements IAdminSubscriptionController {

  private _adminSubscriptionService: IAdminSubscriptionService;

  constructor(adminSubscriptionService: IAdminSubscriptionService) {
    this._adminSubscriptionService = adminSubscriptionService;
  }

  async getSubscriptionPlan(req: Request, res: Response): Promise<Response> {
    try {
      const plan = await this._adminSubscriptionService.getSubscriptionPlan();
      return res.status(StatusCodes.OK).json(plan);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.ERROR_FETCHING_SUBSCRIPTION_PLAN });
    }
  }

  async deleteSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this._adminSubscriptionService.deleteSubscription(id);
      res.status(StatusCodes.OK).json({ message: Messages.SUBSCRIPTION_DELETED_SUCCESSFULLY });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.FAILED_TO_DELETE_SUBSCRIPTION });
    }
  };


  async createSubscription(req: Request, res: Response) {
    try {
      const data = req.body;
      if (!data.name || !data.price || !data.days) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.MISSING_REQUIRED_FIELDS });
      }
      const created = await this._adminSubscriptionService.createSubscription(data);
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ message: Messages.INTERNAL_SERVER_ERROR, err });
    }
  }


}


export default AdminSubscriptionController