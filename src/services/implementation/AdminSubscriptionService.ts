import { IAdminRepository } from "../../repositories/interface/IAdminRepository";
import { ISubscription } from "../../models/Subscription";
import { IAdminSubscriptionService } from "../../services/interface/IAdminSubscriptionService";

class AdminSubscriptionService implements IAdminSubscriptionService {

    constructor(private _adminRepository: IAdminRepository) { }


    async getSubscriptionPlan(): Promise<ISubscription[]> {
        return await this._adminRepository.getFixedSubscriptionPlan();
    }

    async createSubscription(subscriptionData: ISubscription) {
        return this._adminRepository.create(subscriptionData);
    }

    async deleteSubscription(id: string) {
        return this._adminRepository.deleteSubscription(id);
    }
}

export default AdminSubscriptionService