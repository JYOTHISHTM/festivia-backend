import { IWalletService } from "../interface/IWalletService";
import Stripe from 'stripe';
import { IWalletRepository } from "../../repositories/interface/IWalletRepository";
import { ITicketRepository } from "../../repositories/interface/ITicketRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { ICreatorRepository } from "../../repositories/interface/ICreatorRepository";
import { Types } from 'mongoose';
import { WalletMessages } from "../../enums/StatusCodes";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

class WalletService implements IWalletService {
  constructor(
    private _walletRepository: IWalletRepository,
    private _ticketRepository: ITicketRepository,
    private _userRepository: IUserRepository,
    private _creatorRepository: ICreatorRepository
  ) { }

  async bookTicketUsingWallet(userId: string, totalAmount: number, bookingDetails: any) {
    const wallet = await this._walletRepository.getWalletForBooking(userId);
    if (!wallet || wallet.balance < totalAmount) {
      return { success: false, message: WalletMessages.INSUFFICIENT_BALANCE };
    }

    const updated = await this._walletRepository.deductAmount(userId, totalAmount);
    if (!updated) {
      return { success: false, message: WalletMessages.FAILED_TO_DEDUCT };
    }

    const { seatLayoutId, selectedSeats, eventId } = bookingDetails;

    for (const seat of selectedSeats) {
      await this._ticketRepository.markSeatAsBooked(seatLayoutId, seat);
    }

    const savedTicket = await this._ticketRepository.createTicket({
      userId: new Types.ObjectId(userId),
      eventId: new Types.ObjectId(eventId),
      price: totalAmount,
      seats: selectedSeats,
      paymentStatus: 'success'
    });

    return {
      success: true,
      message: WalletMessages.BOOKING_SUCCESS,
      data: {
        ticket: savedTicket,
        selectedSeats,
        eventId,
      }
    };
  }

  async addMoney(userId: string, amount: number) {
    if (amount <= 0) throw new Error(WalletMessages.AMOUNT_MUST_BE_MORE_THAN_ZERO);
    if (amount > 10000) throw new Error(WalletMessages.AMOUNT_CANNOT_EXCEED_LIMIT);

    let wallet = await this._walletRepository.getWalletByUserId(userId);
    if (!wallet) {
      wallet = await this._walletRepository.createWallet(userId);
    }

    const totalAfterAdd = wallet.balance + amount;
    if (totalAfterAdd > 50000) throw new Error(WalletMessages.WALLET_LIMIT_EXCEEDED);

    return await this._walletRepository.updateWallet(userId, amount, 'add');
  }

  async addMoneyToCreator(creatorId: string, amount: number) {
    if (amount <= 0) throw new Error(WalletMessages.AMOUNT_MUST_BE_MORE_THAN_ZERO);
    if (amount > 10000) throw new Error(WalletMessages.AMOUNT_CANNOT_EXCEED_LIMIT);

    let wallet = await this._walletRepository.getWalletByCreatorId(creatorId);
    if (!wallet) {
      wallet = await this._walletRepository.createWalletForCreator(creatorId);
    }

    const totalAfterAdd = wallet.balance + amount;
    if (totalAfterAdd > 50000) throw new Error(WalletMessages.WALLET_LIMIT_EXCEEDED);

    return await this._walletRepository.updateWalletToCreator(creatorId, amount, 'add');
  }

  async getWallet(userId: string) {
    let wallet = await this._walletRepository.getWalletByUserId(userId);
    if (!wallet) {
      wallet = await this._walletRepository.createWallet(userId);
    }
    return wallet;
  }

  async getWalletForCreator(creatorId: string) {
    let wallet = await this._walletRepository.getWalletByCreatorId(creatorId);
    if (!wallet) {
      wallet = await this._walletRepository.createWalletForCreator(creatorId);
    }
    return wallet;
  }
  async createStripeSession(userId: string, amount: number): Promise<string | null> {
    if (!userId || !amount) {
      throw new Error(WalletMessages.USER_ID_AND_AMOUNT_REQUIRED);
    }

    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error(WalletMessages.USER_NOT_FOUND);
    }

    const amountInPaise = amount * 100;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Add ₹${amount} to Wallet`,
            description: `Wallet top-up for ${user.name}`,
          },
          unit_amount: amountInPaise,
        },
        quantity: 1,
      }],
      customer_email: user.email,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/user/wallet?userId=${userId}&amount=${amount}`,
      cancel_url: `${process.env.FRONTEND_URL}/wallet/cancel`,
    });

    return session.url;
  }

  async createStripeSessionForCreator(creatorId: string, amount: number): Promise<string | null> {
    if (!creatorId || !amount) {
      throw new Error(WalletMessages.CREATOR_ID_AND_AMOUNT_REQUIRED);
    }

    const creator = await this._creatorRepository.findById(creatorId);
    if (!creator) {
      throw new Error(WalletMessages.CREATOR_NOT_FOUND);
    }

    const amountInPaise = amount * 100;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Add ₹${amount} to Wallet`,
            description: `Wallet top-up for ${creator.name}`,
          },
          unit_amount: amountInPaise,
        },
        quantity: 1,
      }],
      customer_email: creator.email,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/creator/wallet?creatorId=${creatorId}&amount=${amount}`,
      cancel_url: `${process.env.FRONTEND_URL}/wallet/cancel`,
    });

    return session.url;
  }
}

export default WalletService;
