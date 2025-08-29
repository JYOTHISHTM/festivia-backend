import mongoose from "mongoose";
import SeatLayoutModel from '../../models/SeatLayoutModel';
import { ITicketRepository } from "../interface/ITicketRepository";
import { ITicket, Ticket } from "../../models/Ticket";
import Event from '../../models/Event';

class TicketRepository implements ITicketRepository {
  async getTicketSummaryByCreator(
    creatorId: string,
    selectedEventId?: string,
    page: number = 1,
    limit: number = 2
  ) {
    const skip = (page - 1) * limit;

    return await Ticket.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event"
        }
      },
      { $unwind: "$event" },
      {
        $match: {
          "event.creatorId": new mongoose.Types.ObjectId(creatorId)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$event._id",
          eventName: { $first: "$event.eventName" },
          eventImage: { $first: "$event.image" },
          ticketsSold: { $sum: 1 },
          totalRevenue: { $sum: "$price" },
          allBuyers: {
            $push: {
              name: "$user.name",
              email: "$user.email",
              price: "$price",
              createdAt: "$createdAt"
            }
          }
        }
      },
      {
        $addFields: {
          buyers: {
            $cond: {
              if: selectedEventId ? { $eq: ["$_id", new mongoose.Types.ObjectId(selectedEventId)] } : { $eq: [1, 1] },
              then: { $slice: ["$allBuyers", skip, limit] },
              else: []
            }
          },
          totalBuyers: { $size: "$allBuyers" },
          totalPages: {
            $cond: {
              if: selectedEventId ? { $eq: ["$_id", new mongoose.Types.ObjectId(selectedEventId)] } : { $eq: [1, 1] },
              then: { $ceil: { $divide: [{ $size: "$allBuyers" }, limit] } },
              else: 0
            }
          },
          currentPage: {
            $cond: {
              if: selectedEventId ? { $eq: ["$_id", new mongoose.Types.ObjectId(selectedEventId)] } : { $eq: [1, 1] },
              then: page,
              else: 0
            }
          },
          isSelected: {
            $cond: {
              if: selectedEventId ? { $eq: ["$_id", new mongoose.Types.ObjectId(selectedEventId)] } : { $eq: [1, 1] },
              then: true,
              else: false
            }
          }
        }
      },
      {
        $project: {
          allBuyers: 0
        }
      },
      { $sort: { eventName: 1 } }
    ]);
  }

  async markSeatAsBooked(seatLayoutId: string, seatNumber: string) {
    return await SeatLayoutModel.updateOne(
      { _id: seatLayoutId, "seats.seatNumber": seatNumber },
      { $set: { "seats.$.isBooked": true } }
    );
  }
   async createTicket(ticketData: Partial<ITicket>): Promise<ITicket> {
    return await Ticket.create(ticketData);
  }

    async getUsersWhoBoughtTicketsByCreator(
    creatorId: string,
    skip: number,
    limit: number
  ): Promise<{ tickets: any[]; totalCount: number }> {
    const creatorEvents = await Event.find({ creatorId }).select('_id');
    const eventIds = creatorEvents.map(event => event._id);

    const tickets = await Ticket.find({ eventId: { $in: eventIds } })
      .populate('userId', 'name email')
      .populate('eventId', 'eventName createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalCount = await Ticket.countDocuments({ eventId: { $in: eventIds } });

    return { tickets, totalCount };
  }
}

export default  TicketRepository
