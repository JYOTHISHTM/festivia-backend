
export interface IAdminUserService {
    blockUser(userId: string): Promise<any>;
    getUsers(): Promise<any>;
}
