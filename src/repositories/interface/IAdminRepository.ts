import { IAdmin } from "../../models/Admin";
import { ISubscription } from "../../models/Subscription";
import { ICreator } from "../../models/Creator";

export interface IAdminRepository {
  findByUsername(username: string): Promise<IAdmin | null>;
  findByRefreshToken(refreshToken: string): Promise<IAdmin | null>;
  updateRefreshToken(adminId: string, refreshToken: string): Promise<void>;
  clearRefreshToken(adminId: string): Promise<void>;
  updateCreatorStatusToPending(creatorId: string): Promise<ICreator | null>;
  getFixedSubscriptionPlan(): Promise<ISubscription[]>;
  create<T extends object>(data: T): Promise<object>;
  deleteSubscription(id: string): Promise<ISubscription | null>;
  searchCreators(search: string): Promise<ICreator[]>;
}
