import Actor from "../../models/actor.model";
import {APIError} from "../errors";
import mongoose from "mongoose";
import {getSlug} from "../functions";

export const createOrUpdateActor = async (actorObject: any) => {
    if (!actorObject) {
        throw new Error('Actor object is required');
    }

    actorObject.slug = getSlug(actorObject.name);

    try {
        let existingActor = await Actor.findOne(
            {
                $or: [
                    { name: actorObject.name },
                    { slug: actorObject.slug }
                ]
            });
        if (existingActor) {
            actorObject.modifiedAt = Date.now();
            const updateData = {
                ...actorObject,
                name: undefined,
                slug: undefined,
                id: undefined,
            };
            existingActor = await Actor.findByIdAndUpdate(existingActor._id, updateData, {new: true});
            return existingActor;
        } else {
            const newActor = new Actor(actorObject);
            await newActor.save();
            return newActor
        }
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            throw new APIError(422, 'Validation Error');
        } else {
            throw new APIError(500, 'Internal Server Error');
        }
    }
}

export const processActorsAI = async (actors: any[]) => {
    const actorPromises = Object.entries(actors).map(async ([actorName, character]) => {
        try {
            const actor = await createOrUpdateActor({ name: actorName });
            return { actor_id: actor?.id, character };
        } catch (error) {
            // Handle errors specifically for actor processing
            throw new Error(`Error processing actor: ${actorName}, ${error}`);
        }
    });

    return Promise.all(actorPromises);
}

export const getActorByName = async (name: string) => {
    if (!name) {
        throw new Error('Actor name is required');
    }

    try {
         const actor = await Actor.findOne({name: name});
         if (!actor) {
             return await createOrUpdateActor({name: name});
         }
         return actor;
    } catch (error) {
        throw new APIError(500, 'Internal Server Error');
    }

}
