import mongoose, { Document, Schema, Model } from 'mongoose';
import { IProcessor } from '../types/processorMongoInterfaces';

export const ProcessorSchema: Schema<IProcessor> = new Schema({
    sale_id: {
        type: Number
    },
    pack_id: {
        type: Number
    }
}, {
    collection: 'orchestrator.meli.batches.processed'
})

const ProcessorModel: Model<IProcessor> = mongoose.models.Processor || mongoose.model<IProcessor>('Processor', ProcessorSchema);

export default ProcessorModel;