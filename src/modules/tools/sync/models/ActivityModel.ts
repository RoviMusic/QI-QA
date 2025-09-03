import mongoose, { Document, Schema, Model } from "mongoose";

export interface IActivity extends Document {
  _id: mongoose.Types.ObjectId;
  timestamp: Date;
}

export const ActivitySchema: Schema<IActivity> = new Schema(
  {
    timestamp: {
      type: Date,
    },
  },
  {
    collection: "stock.sync.activity",
  }
);

const ActivityModel: Model<IActivity> =
  mongoose.models.Activity ||
  mongoose.model<IActivity>("Activity", ActivitySchema);

export default ActivityModel;
