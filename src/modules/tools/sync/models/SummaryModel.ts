import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISummary extends Document {
    _id: mongoose.Types.ObjectId;
    total_processed: number;
    success_count: number;
    error_count: number;
    failure_count: number;
    start_time: Date;
    success_rate_percent: number;
    source: string;
    duration_seconds: number;
    duration_minutes: number;
}

export const SummarySchema: Schema<ISummary> = new Schema({
    source: {
        type: String
    },
    total_processed: {
        type: Number
    },
    start_time: {
        type: Date
    },
    success_count: {
        type: Number
    },
    error_count: {
        type: Number
    },
    failure_count: {
        type: Number
    },
    success_rate_percent: {
        type: Number
    },
    duration_minutes: {
        type: Number
    },
    duration_seconds: {
        type: Number
    }
}, {
    collection: 'stock.sync.summaries'
})

const SummaryModel: Model<ISummary> = mongoose.models.Summary || mongoose.model<ISummary>('Summary', SummarySchema)

export default SummaryModel;