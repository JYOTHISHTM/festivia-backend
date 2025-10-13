import { ICreator } from "../../models/Creator";

export interface IAdminCreatorService {
    blockCreator(creatorId: string): Promise<ICreator | null>;
    handleCreatorReapply(creatorId: string): Promise<ICreator | null>;
    approveCreator(creatorId: string): Promise<ICreator | null>;
    rejectCreator(creatorId: string, rejectionReason: string): Promise<ICreator | null>;
    getCreators(): Promise<ICreator[]>;
    getPendingCreators(): Promise<ICreator[]>;
    getCreatorStatus(creatorId: string): Promise<ICreator | null>;
    getCreatorsBySearch(search: string): Promise<ICreator[]>;
}
