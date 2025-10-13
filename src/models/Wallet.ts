import mongoose, { Document, Schema, Types } from "mongoose";

export interface IWallet extends Document {
  user?: Types.ObjectId;
  creator?: Types.ObjectId;
  balance: number;
  transactions: {
    type: "add" | "refund" | "deduct";
    amount: number;
    date: Date;
  }[];
}

const walletSchema = new Schema<IWallet>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    sparse: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "Creator",
    unique: true,
    sparse: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      type: {
        type: String,
        enum: ["add", "refund", "deduct"],
      },
      amount: Number,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export const Wallet = mongoose.model<IWallet>("Wallet", walletSchema);
export type WalletDocument = IWallet; // alias for clarity
