// services/validateLayout.ts

import mongoose from "mongoose";
import SeatLayoutModel from "../models/SeatLayoutModel";

export const validateAndMarkLayout = async (layoutId: string) => {
  if (!mongoose.Types.ObjectId.isValid(layoutId)) {
    throw new Error("Invalid layout ID");
  }

  const layout = await SeatLayoutModel.findById(layoutId);
  if (!layout) throw new Error("Seat layout not found");
  if (layout.isUsed) throw new Error("Layout already used");

  layout.isUsed = true;
  await layout.save();
  return layout._id;
};
