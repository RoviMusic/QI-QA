import mongoose, { Schema, Model } from 'mongoose';
import { IProcessorPending } from '../types/processorMongoInterfaces';

export const AmazonPendingSchema: Schema<IProcessorPending> = new Schema({
    sale_id: {
        type: Number
    },
    message: {
        type: String
    }
}, {
    collection: 'orchestrator.amazon.batches.pending'
})

const AmazonPendingModel: Model<IProcessorPending> = mongoose.models.AmazonPending || mongoose.model<IProcessorPending>('AmazonPending', AmazonPendingSchema);

export default AmazonPendingModel;