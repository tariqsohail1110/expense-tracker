export const validate = (validateFN) => {
    return (req, res, next) => {
        const { isValid, errors } = validateFN(req.body);
        if(!isValid) {
            return res.status(400).json({ errors });
        }
        next();
    }
}