
export interface IWalletRepository {

  deductAmount(userId: string, totalAmount: number): Promise<object>
  getWalletByCreatorId(creatorId: string): Promise<object>
  createWalletForCreator(creatorId: string): Promise<object>
  updateWalletToCreator(creatorId: string, amount: number, type: 'add' | 'refund'): Promise<object>
  createWallet(userId: string): Promise<object>
  getWalletByUserId(userId: string): Promise<object>
  getWalletForBooking(userId: string): Promise<object>
  updateWallet(userId: string, amount: number, type: 'add' | 'refund' | 'deduct'): Promise<object>
}
