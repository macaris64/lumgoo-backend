import mongoose, {Document, Schema} from "mongoose";

export interface IMovie extends Document {
    title: string, // Title of the movie
    slug?: string, // Slug of the movie
    imdbId?: string, // IMDB ID of the movie
    genre?: string[], // Genre of the movie
    actors?: string[], // Actors of the movie
    imdbRating?: number, // IMDB rating of the movie
    director?: string[], // Director of the movie
    plot?: string, // Plot of the movie
    images?: string[], // Images of the movie
    releaseDate?: Date, // Release date of the movie
    runtime?: string, // The duration of the movie, typically in minutes.
    country?: string[], // The country or countries where the movie was produced.
    language?: string, // The language or languages spoken in the movie.
    budget?: number, // The budget involved in the production of the movie.
    boxOffice?: number, // The box office revenue of the movie.
    mpaaRating?: string, // The age rating according to the Motion Picture Association of America (MPAA), if applicable.
    userRating?: number, // A rating system within your app where users can rate the movie.
    userReviews?: string[], // User-written reviews or comments on the movie.
    awards?: string[], // Any awards or nominations the movie has received.
    productionCompanies?: string[], // Names of the companies that produced the movie.
    distributionCompanies?: string[], // Names of the companies that distributed the movie.
    officialWebsite?: string, // The official website of the movie.
    trailerUrl?: string, // A URL pointing to the official trailer of the movie.
    screenplayBy?: string[], // The person or people who wrote the screenplay for the movie.
    cinematographyBy?: string[], // The person or people who were the cinematographers for the movie.
    editedBy?: string[], // The person or people who edited the movie.
    musicBy?: string[], // The person or people who composed the movie's music.
    visualEffectsBy?: string[], // The person or people who were in charge of the visual effects of the movie.
    streamingAvailability?: object, // A URL pointing to a streaming version of the movie.
    createdAt: Date,
    modifiedAt: Date,
    isDeleted?: boolean,
    deletedAt?: Date,
}

export const validatorObject: Object = {
    title: '',
}

const movieSchema: Schema <IMovie> = new mongoose.Schema({
    title: {
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
    imdbId: {
        type: String,
        unique: true,
        default: null,
    },
    genre: {
        type: [String],
        required: true,
        default: [],
    },
    actors: {
        type: [String],
        default: [],
    },
    imdbRating: {
        type: Number,
        default: 0,
    },
    director: {
        type: [String],
        default: [],
    },
    plot: {
        type: String,
        default: '',
    },
    images: {
        type: [String],
        default: [],
    },
    releaseDate: {
        type: Date,
        default: null,
    },
    runtime: {
        type: String,
        default: '',
    },
    country: {
        type: [String],
        default: [],
    },
    language: {
        type: String,
        default: '',
    },
    budget: {
        type: Number,
        default: 0,
    },
    boxOffice: {
        type: Number,
        default: 0,
    },
    mpaaRating: {
        type: String,
        default: '',
    },
    userRating: {
        type: Number,
        default: 0,
    },
    userReviews: {
        type: [String],
        default: [],
    },
    awards: {
        type: [String],
        default: [],
    },
    productionCompanies: {
        type: [String],
        default: [],
    },
    distributionCompanies: {
        type: [String],
        default: [],
    },
    officialWebsite: {
        type: String,
        default: '',
    },
    trailerUrl: {
        type: String,
        default: '',
    },
    screenplayBy: {
        type: [String],
        default: [],
    },
    cinematographyBy: {
        type: [String],
        default: [],
    },
    editedBy: {
        type: [String],
        default: [],
    },
    musicBy: {
        type: [String],
        default: [],
    },
    visualEffectsBy: {
        type: [String],
        default: [],
    },
    streamingAvailability: {
        type: {},
        default: {},
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
})

const Movie = mongoose.model<IMovie>('Movie', movieSchema);

export default Movie;
