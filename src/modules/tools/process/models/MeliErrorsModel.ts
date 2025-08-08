import mongoose, { Document, Schema, Model } from 'mongoose';
import { IProcessorErrors } from '../types/processorMongoInterfaces';

export const MeliErrorsSchema: Schema<IProcessorErrors> = new Schema({
    sale_id: {
        type: Number
    },
    message: {
        type: String
    }
}, {
    collection: 'orchestrator.meli.batches.process_errors'
})

const MeliErrorModel: Model<IProcessorErrors> = mongoose.models.MeliErrors || mongoose.model<IProcessorErrors>('MeliErrors', MeliErrorsSchema);

export default MeliErrorModel;