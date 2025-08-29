export interface IAdminCreatorService {

    blockCreator(creatorId: string): Promise<any>;
    handleCreatorReapply(creatorId: string): Promise<any>;
    approveCreator(creatorId: string): Promise<any>
    rejectCreator(creatorId: string, rejectionReason: string): Promise<any>
    getCreators(): Promise<any>;
    getPendingCreators(): Promise<any>
    getCreatorStatus(creatorId: string): Promise<any>
    getCreatorsBySearch(search: string): Promise<any>

}
