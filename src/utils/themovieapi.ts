import axios from 'axios';
import {APIError} from "./errors";

class TmdbApi {
    private apiKey?: string;
    private baseUrl?: string;
    private language: string;
    private token?: string;
    private requestDelay: number = 2000;
    constructor() {
        this.apiKey = process.env.THE_MOVIE_DB_API_KEY;
        this.baseUrl = process.env.THE_MOVIE_DB_HOST;
        this.token = process.env.THE_MOVIE_DB_ACCESS_TOKEN;
        this.language = "en-US";
    }

    private async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async fetchData(endpoint: string, params: any) {
        await this.delay(this.requestDelay);
        const endpointUrl = `${this.baseUrl}/${endpoint}`;
        try {
            const response = await axios.get(endpointUrl, {
                params: {
                    language: this.language,
                    ...params
                },
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    Accept: "application/json"
                }
            });
            return response.data;
        } catch (error) {
            console.log(error)
            throw new APIError(500, 'Failed to make request to The Movie DB API');
        }
    }

    public async getNowPlayingMovies(page: string) {
        try {
            const endpoint = "movie/now_playing";
            const params = {
                page: page
            }
            return await this.fetchData(endpoint, params);
        } catch (error) {
            throw new APIError(500, 'Failed to get now playing movies');
        }
    }

    public async getMovieById(id: string) {
        const endpoint = `movie/${id}`;
        return await this.fetchData(endpoint, {});
    }

    public async getMovieCreditsById(id: string) {
        const endpoint = `movie/${id}/credits`;
        return await this.fetchData(endpoint, {});
    }

    public async getPersonById(id: string) {
        const endpoint = `person/${id}`;
        return await this.fetchData(endpoint, {});
    }
}

export default TmdbApi;
