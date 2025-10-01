import mongoose from "mongoose";

export interface IProcessorErrors extends Document {
  _id: mongoose.Types.ObjectId;
  sale_id: number;
  message: string;
}

export interface IProcessorPending extends Document {
  _id: mongoose.Types.ObjectId;
  sale_id: number;
  message: string;
}

export interface IProcessor extends Document {
  _id: mongoose.Types.ObjectId;
  sale_id: number;
  pack_id: number;
  shipment_reference: string;
  warning?: string;
}
