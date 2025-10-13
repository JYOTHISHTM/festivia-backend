import { IAdmin } from "../../models/Admin";
import { ISubscription } from "../../models/Subscription";

export interface IAdminRepository {
  findByUsername(username: string): Promise<IAdmin | null>;
  findByRefreshToken(refreshToken: string): Promise<IAdmin | null>;
  updateRefreshToken(adminId: string, refreshToken: string): Promise<void>;
  clearRefreshToken(adminId: string): Promise<void>;
  updateCreatorStatusToPending(creatorId: string): Promise<Response>;
  getFixedSubscriptionPlan(): Promise<ISubscription[]>;
  create<T extends object>(data: T): Promise<object>;
  deleteSubscription(id: string): Promise<object>
  searchCreators(search:string):Promise<object>
}
