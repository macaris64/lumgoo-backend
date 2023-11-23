import slugify from 'slugify';

export const getSlug = (text: string): string => {
    return slugify(text, {
        lower: true, // convert to lower case
        strict: true, // strip special characters except replacement
        // add any additional options you need
    });
};
