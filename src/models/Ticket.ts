import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITicket extends Document {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  price: number;
  seats: number[];
  paymentStatus: "success" | "pending" | "cancelled";
  createdAt: Date;
}

const ticketSchema = new Schema<ITicket>({
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
});

export const Ticket = mongoose.model<ITicket>("Ticket", ticketSchema);
