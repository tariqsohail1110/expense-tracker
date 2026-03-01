export const validateIntegerValues = (id, name) => {
    if(!id || id < 0 || !Number.isInteger(Number(id))) {
        throw new Error(`Invalid ${ name }`);
    }
}