import mongoose, {Document, Schema} from "mongoose";

interface IMovie extends Document {
    title: string, // Title of the movie
    slug: string, // Slug of the movie
    genre: string[], // Genre of the movie
    actors: string[], // Actors of the movie
    imdbRating: number, // IMDB rating of the movie
    director: string[], // Director of the movie
    plot: string, // Plot of the movie
    images: string[], // Images of the movie
    releaseDate: Date, // Release date of the movie
    runtime?: number, // The duration of the movie, typically in minutes.
    country?: string, // The country or countries where the movie was produced.
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
    streamingAvailability?: string[], // A URL pointing to a streaming version of the movie.
    createdAt: Date,
    modifiedAt: Date,
}

const movieSchema: Schema <IMovie> = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    genre: {
        type: [String],
        required: true,
    },
    actors: {
        type: [String],
        required: true,
    },
    imdbRating: {
        type: Number,
        required: true,
    },
    director: {
        type: [String],
        required: true,
    },
    plot: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    runtime: {
        type: Number,
    },
    country: {
        type: String,
    },
    language: {
        type: String,
    },
    budget: {
        type: Number,
    },
    boxOffice: {
        type: Number,
    },
    mpaaRating: {
        type: String,
    },
    userRating: {
        type: Number,
    },
    userReviews: {
        type: [String],
    },
    awards: {
        type: [String],
    },
    productionCompanies: {
        type: [String],
    },
    distributionCompanies: {
        type: [String],
    },
    officialWebsite: {
        type: String,
    },
    trailerUrl: {
        type: String,
    },
    screenplayBy: {
        type: [String],
    },
    cinematographyBy: {
        type: [String],
    },
    editedBy: {
        type: [String],
    },
    musicBy: {
        type: [String],
    },
    visualEffectsBy: {
        type: [String],
    },
    streamingAvailability: {
        type: [String],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    modifiedAt: {
        type: Date,
        default: Date.now
    },
})

const Movie = mongoose.model<IMovie>('Movie', movieSchema);

export default Movie;
