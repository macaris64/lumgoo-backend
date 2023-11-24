import mongoose, {Document, Schema} from "mongoose";

interface SocialMedia {
    instagram?: string;
    imdb?: string;
}

export interface IActor extends Document {
    name: string;
    slug?: string;
    movies?: string[];
    images?: string[];
    birthday?: Date;
    country?: string;
    height?: number;
    awards?: string[];
    bio?: string;
    socialMedia?: SocialMedia;
    gender?: string;
    deathday?: Date;
    rating?: number;
    personalQuotes?: string[];
    createdAt: Date;
    modifiedAt: Date;
    isDeleted?: boolean;
    deletedAt?: Date;
}

export const validatorObject: Object = {
    name: '',
}

const actorSchema: Schema<IActor> = new mongoose.Schema({
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
    movies: {
        type: [String],
        required: true,
        default: [],
    },
    images: {
        type: [String],
        default: [],
    },
    birthday: {
        type: Date,
        default: null
    },
    country: {
        type: String,
        default: null
    },
    height: {
        type: Number,
        default: null
    },
    awards: {
        type: [String],
        default: []
    },
    bio: {
        type: String,
        default: null
    },
    socialMedia: {
        type: Object,
        default: {}
    },
    gender: {
        type: String,
        default: null
    },
    deathday: {
        type: Date,
        default: null
    },
    rating: {
        type: Number,
        default: null
    },
    personalQuotes: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    modifiedAt: {
        type: Date,
        default: Date.now,
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

const Actor = mongoose.model<IActor>('Actor', actorSchema);

export default Actor;
