// services/interface/IStripeService.ts

export interface StripeMetadata {
  [key: string]: string | number | boolean;
}

export interface IStripeService {
  createCheckoutSession(
    amount: number,
    successUrl: string,
    cancelUrl: string,
    metadata?: StripeMetadata,
    productName?: string
  ): Promise<string>;
}
