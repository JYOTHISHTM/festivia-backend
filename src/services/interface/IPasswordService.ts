export interface IPasswordService {
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void>;
  
    resetPassword(
      email: string,
      newPassword: string,
      type: "user" | "creator"
    ): Promise<string>;
  
}
