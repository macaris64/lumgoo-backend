import {OpenAI} from "openai";
import {
    getMovieDataForGivenMovieTitlesSystemMessage,
    getMovieRecommendationsForGivenFiltersSystemMessage, getSlimMovieRecommendationsForGivenFiltersSystemMessage
} from "./constants";

import {APIError} from "./errors";


export async function getMovieRecommendationsFromAI(filter: string, slim: boolean): Promise<any> {
    try {
        const systemMessage = slim ?
            getSlimMovieRecommendationsForGivenFiltersSystemMessage :
            getMovieRecommendationsForGivenFiltersSystemMessage;
        const aiResponse = await chatCompletionsApi(
            systemMessage,
            filter,
            3000,
            'gpt-3.5-turbo',
            false
        )

        const jsonString = aiResponse.replace(/'/g, '"');
        return JSON.parse(jsonString);
    } catch (error) {
        throw error;
    }
}


export async function getMultipleMoviesDataFromAI(movieTitles: string[]): Promise<any> {
    try {
        const aiResponse = await chatCompletionsApi(
            getMovieDataForGivenMovieTitlesSystemMessage,
            movieTitles.join(", "),
            3600
        )
        return JSON.parse(aiResponse);
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
        throw new APIError(500, "Failed to call OpenAI");
    }
    try {
        if (response &&
            response.choices &&
            response.choices.length > 0 &&
            response.choices[0].message &&
            response.choices[0].message.content
        ) {
            return response.choices[0].message.content;
        }
    } catch (error) {
        throw new APIError(500, "Invalid response format from OpenAI");
    }
    throw new APIError(500, "Invalid response from OpenAI");
}
