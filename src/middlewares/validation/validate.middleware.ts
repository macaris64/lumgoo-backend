export const validateParams = (data: any, validatorObject: any): boolean => {
    for (const key in validatorObject) {
        if (!data.hasOwnProperty(key) || typeof data[key] !== typeof validatorObject[key]) {
            return false;
        }
    }
    return true;
};

export const validateEmail = (email: string): boolean => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
