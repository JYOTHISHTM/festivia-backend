// services/interface/IStripeService.ts

export interface IStripeService {
  createCheckoutSession(
    amount: number,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, any>,
    productName?: string
  ): Promise<string>;
}
