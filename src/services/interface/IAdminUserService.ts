
export interface IAdminUserService {
    blockUser(userId: string): Promise<object | null>;
    getUsers(): Promise<object>
}
