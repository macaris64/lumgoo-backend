import {APIError} from "../utils/errors";

interface MovieFilterObject {
    name?: string[];
    genre?: string[];
    actorName?: string[];
    releaseDate?: string[];
    director?: string[];
    country?: string[];
}

export const validateMovieFilterObject = (filterObject: any) => {
    const availableFilters = ["name", "genre", "actorName", "releaseDate", "director", "country"];
    if (!filterObject || typeof filterObject !== 'object') {
        throw new APIError(400, 'Object must have a "filter" key with an object value');
    }
    Object.keys(filterObject).forEach(key => {
        if (!availableFilters.includes(key)) {
            throw new APIError(400, `Invalid key found: ${key}`);
        }
    });
    Object.entries(filterObject as MovieFilterObject).forEach(([key, value]) => {
        if (!Array.isArray(value)) {
            throw new APIError(400,`Value for key ${key} should be an array`);
        }
    });
}

export const transformMovieFilter = (filterObject: MovieFilterObject): string => {
    let jsonString = JSON.stringify(filterObject);
    jsonString = jsonString.replace(/"([^"]+)":/g, "'$1':");
    jsonString = jsonString.replace(/:"([^"]+)"/g, ":'$1'");
    jsonString = jsonString.replace(/"/g, "'");

    return jsonString;
}
