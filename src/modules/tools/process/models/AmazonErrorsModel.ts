import mongoose, { Schema, Model } from 'mongoose';
import { IProcessorErrors } from '../types/processorMongoInterfaces';

export const AmazonErrorsSchema: Schema<IProcessorErrors> = new Schema({
    sale_id: {
        type: Number
    },
    message: {
        type: String
    }
}, {
    collection: 'orchestrator.amazon.batches.process_errors'
})

const AmazonErrorModel: Model<IProcessorErrors> = mongoose.models.AmazonErrors || mongoose.model<IProcessorErrors>('AmazonErrors', AmazonErrorsSchema);

export default AmazonErrorModel;