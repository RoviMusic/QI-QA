import mongoose, { Document, Schema, Model } from "mongoose";

export interface IProductsList extends Document {
  _id: mongoose.Types.ObjectId;
  query: string;
}

export const ProductsListSchema: Schema<IProductsList> = new Schema(
  {
    query: {
      type: String,
    },
  },
  {
    collection: "ml_competition", //cambiar por la coleccion correcta
  }
);

const ProductsListModel: Model<IProductsList> =
  mongoose.models?.ProductsList ||
  mongoose.model<IProductsList>("ProductsList", ProductsListSchema);

export default ProductsListModel;
