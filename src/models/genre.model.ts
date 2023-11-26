import mongoose, {Document, Schema} from "mongoose";

export interface IGenre extends Document {
    name: string;
    slug?: string;
    theMovieDbId?: number;
    createdAt: Date;
    modifiedAt: Date;
    isDeleted?: boolean;
    deletedAt?: Date;
}

export const validatorObject: Object = {
    name: '',
}

const genreSchema: Schema<IGenre> = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        default: null,
    },
    theMovieDbId: {
        type: Number,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    modifiedAt: {
        type: Date,
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
});

export default mongoose.model<IGenre>('Genre', genreSchema);
