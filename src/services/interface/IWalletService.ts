export interface IBookTicketWalletResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface IWalletService {
  addMoney(userId: string, amount: number): Promise<object>;

  bookTicketUsingWallet(
    userId: string,
    totalAmount: number,
    bookingDetails: any
  ): Promise<IBookTicketWalletResponse>;

  addMoneyToCreator(creatorId: string, amount: number): Promise<object>;

  getWallet(userId: string): Promise<object>;

  getWalletForCreator(creatorId: string): Promise<object>;

  createStripeSession(userId: string, amount: number): Promise<string | null>;

  createStripeSessionForCreator(
    creatorId: string,
    amount: number
  ): Promise<string | null>;
}