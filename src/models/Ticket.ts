import mongoose, { Document, Schema, Types } from "mongoose";
import { IEvent } from "./Event";
import { IUser } from "./User";

export interface ITicket {
  userId: Types.ObjectId | IUser;
  eventId: Types.ObjectId | IEvent;
  price: number;
  seats: number[];
  paymentStatus: "success" | "pending" | "cancelled";
  createdAt: Date;
  qrCode?: string;
}

export interface TicketDocument extends ITicket, Document {
  _id: Types.ObjectId;
}

const ticketSchema = new Schema<TicketDocument>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  price: { type: Number, required: true },
  seats: [{ type: Number, required: true }],
  paymentStatus: {
    type: String,
    enum: ["success", "pending", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  qrCode: { type: String },
});

export const Ticket = mongoose.model<TicketDocument>("Ticket", ticketSchema);
