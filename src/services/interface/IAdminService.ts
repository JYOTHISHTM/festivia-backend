export interface IAdminService {

  login(username: string, password: string): Promise<{
    token: string;
    refreshToken: string;
    admin: { _id: string; username: string }
  }>;

  refreshToken(refreshToken: string): Promise<string | null>;
  logout(refreshToken: string): Promise<void>;
  getDashboardData(): Promise<any>;

}
