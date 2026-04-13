export const validateChangeRoleDto = (data) => {
    const errors = {};
    if(!data || Object.keys(data).length === 0 ) {
        return {
            isValid: false,
            errors: { message: "At least one field is required to update"}
        };
    };

    if(data.role !== undefined) {
        if(typeof data.role !== 'string') {
            errors.role('Invalid Role');
        }else if(data.role !== 'user' || data.role !== 'admin') {
            errors.role('Invalid Role, must be admin or user');
        }
    }

    return {
        isValid: Object.keys(errors).length === 0, errors
    };
}