
export interface IWalletRepository {

  deductAmount(userId: string, totalAmount: number): Promise<any>;
  // getUserById(userId: string): Promise<any>;
  getWalletByCreatorId(creatorId: string): Promise<any>;
  createWalletForCreator(creatorId: string): Promise<any>;
  updateWalletToCreator(creatorId: string, amount: number, type: 'add' | 'refund'): Promise<any>;
  createWallet(userId: string): Promise<any>;
  getWalletByUserId(userId: string): Promise<any>;
  getWalletForBooking(userId: string): Promise<any>;
  updateWallet(userId: string, amount: number, type: 'add' | 'refund' | 'deduct'): Promise<any>;
}
