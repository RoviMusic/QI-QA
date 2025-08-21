import mongoose, { Document, Schema, Model } from 'mongoose';
import { IProcessorPending } from '../types/processorMongoInterfaces';

export const MeliPendingSchema: Schema<IProcessorPending> = new Schema({
    sale_id: {
        type: Number
    },
    message: {
        type: String
    }
}, {
    collection: 'orchestrator.meli.batches.pending'
})

const MeliPendingModel: Model<IProcessorPending> = mongoose.models.MeliPending || mongoose.model<IProcessorPending>('MeliPending', MeliPendingSchema);

export default MeliPendingModel;