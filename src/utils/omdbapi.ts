import axios from 'axios';
import {APIError} from "./errors";

class OmdbApi {
    private apiKey?: string;
    private baseUrl?: string;
    private requestDelay: number = 2000;
    constructor() {
        this.apiKey = process.env.OMBDB_API_KEY;
        this.baseUrl = process.env.OMBDB_API_HOST;
    }

    private async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public async fetchMovieByImdbId(imdbId: string) {
        await this.delay(this.requestDelay);
        const endpointUrl = `${this.baseUrl}/`;
        try {
            const response = await axios.get(endpointUrl, {
                params: {
                    i: imdbId,
                    apikey: this.apiKey,
                },
            });
            if (response.data.Response == 'False') {
                return false;
            } else {
                return response.data;
            }
        } catch (error) {
            console.log(error)
            throw new APIError(500, 'Failed to make request to The Movie DB API');
        }
    }
}

export default OmdbApi;
