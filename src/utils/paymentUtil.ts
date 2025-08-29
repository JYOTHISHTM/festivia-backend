import { stripe } from "./stripe";
import { IEvent } from "../models/Event";
import { IUser } from "../models/User";

export class PaymentUtil {
  static async createStripeCheckoutSession(event: IEvent, user: IUser): Promise<string|null> {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: event.eventName },
            unit_amount: Math.round(event.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/user/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      customer_email: user.email,
    });

    return session.url;
  }
}
