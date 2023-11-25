import {OpenAI} from "openai";
import {
    getMovieDataForGivenMovieTitlesSystemMessage,
    getMovieRecommendationsForGivenFiltersSystemMessage
} from "./constants";

import {APIError} from "./errors";


export async function getMovieRecommendationsFromAI(filter: string): Promise<any> {
    try {
        return await chatCompletionsApi(getMovieRecommendationsForGivenFiltersSystemMessage, filter, 3000)
    } catch (error) {
        throw error;
    }
}

export async function getMultipleMoviesDataFromAI(movieTitles: string[]): Promise<any> {
    try {
        return await chatCompletionsApi(getMovieDataForGivenMovieTitlesSystemMessage, movieTitles.join(", "), 3600)
    } catch (error) {
        throw error;
    }
}



const chatCompletionsApi = async (
    systemMessage: string,
    userMessage: string,
    maxTokens: number,
    model = 'gpt-3.5-turbo',
    json= true,
) => {
    const openaiApi = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
    let response = null;
    try {
        response = await openaiApi.chat.completions.create({
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: userMessage }
            ],
            model: model,
            response_format: {"type": "text"},
            max_tokens: maxTokens,
        });
    } catch (error) {
        console.error("Failed to call OpenAI:", error);
        throw new APIError(500, "Failed to call OpenAI");
    }
    console.log(response);
    try {
        if (response &&
            response.choices &&
            response.choices.length > 0 &&
            response.choices[0].message &&
            response.choices[0].message.content
        ) {
            let aiData = response.choices[0].message.content
            if (json) {
                return JSON.parse(aiData.replace(/'([^']+)'/g, '"$1"'));
            }
            return aiData;
        }
    } catch (error) {
        throw new APIError(500, "Invalid response format from OpenAI");
    }
    throw new APIError(500, "Invalid response from OpenAI");
}
