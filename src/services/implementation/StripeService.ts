// services/StripeService.ts

import { IStripeService } from '../interface/IStripeService';
import { stripe } from '../../utils/stripe';

export class StripeService implements IStripeService {
  async createCheckoutSession(
    amount: number,
    successUrl: string,
    cancelUrl: string,
    metadata: Record<string, any> = {},
    productName: string = 'Wallet Top-up'
  ): Promise<string> {
    const customer = await stripe.customers.create({ metadata });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: { name: productName },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    if (!session.url) {
      throw new Error('Failed to create checkout session URL');
    }

    return session.url;
  }
}
