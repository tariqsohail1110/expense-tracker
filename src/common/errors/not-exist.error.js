export const notExists = (param, name) => {
    if (!param) {
        throw new Error(`${ name } not found!`);
    }return param;
}

export const notFound = (param, name) => {
    if (!param) {
        throw new Error(`${ name } not found!`);
    }
}