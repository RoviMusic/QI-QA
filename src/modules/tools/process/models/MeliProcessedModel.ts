import mongoose, { Document, Schema, Model } from "mongoose";
import { IProcessor } from "../types/processorMongoInterfaces";

export const ProcessorSchema: Schema<IProcessor> = new Schema(
  {
    _id: {
      type: "ObjectId",
    },
    sale_id: {
      type: Number,
    },
    pack_id: {
      type: Number,
    },
    shipment_reference: {
      type: String,
    },
    warning: {
      type: [String],
    },
  },
  {
    collection: "orchestrator.meli.batches.processed",
  }
);

const ProcessorModel: Model<IProcessor> =
  mongoose.models.Processor ||
  mongoose.model<IProcessor>("Processor", ProcessorSchema);

export default ProcessorModel;
