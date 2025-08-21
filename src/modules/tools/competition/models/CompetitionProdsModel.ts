import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProductsList extends Document {
    _id: mongoose.Types.ObjectId;
    label: string;
}

export const ProductsListSchema: Schema<IProductsList> = new Schema({
    label: {
        type: String
    }
}, {
    collection: 'ProductsList' //cambiar por la coleccion correcta
})

const ProductsListModel: Model<IProductsList> = mongoose.models?.ProductsList || mongoose.model<IProductsList>('ProductsList', ProductsListSchema)

export default ProductsListModel;