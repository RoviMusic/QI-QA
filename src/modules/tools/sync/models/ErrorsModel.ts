import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IErrors extends Document {
    _id: mongoose.Types.ObjectId;
    trigger: string;
    error: string;
    timestamp: Date;
}

export const ErrorsSchema: Schema<IErrors> = new Schema({
    trigger: {
        type: String
    },
    error: {
        type: String
    },
    timestamp: {
        type: Date
    }
}, {
    collection: 'stock.sync.errors'
})

const ErrorsModel: Model<IErrors> = mongoose.models.Errors || mongoose.model<IErrors>('Errors', ErrorsSchema)

export default ErrorsModel;