// services/interface/IWalletService.ts
export interface IWalletService {
  addMoney(userId: string, amount: number): Promise<object>
  bookTicketUsingWallet(userId: string, totalAmount: number, bookingDetails: any): Promise<object>
  addMoneyToCreator(creatorId: string, amount: number): Promise<object>
  getWallet(userId: string): Promise<object>
  getWalletForCreator(creatorId: string): Promise<object>
  createStripeSession(userId: string, amount: number): Promise<object>
  createStripeSessionForCreator(creatorId: string, amount: number): Promise<object>
}
