export const validateUpdateAdminDto = (data) => {
    const errors = {}
    
    if(!data || Object.keys(data).length === 0 ) {
        return {
            isValid: false,
            errors: { message: "At least one field is required to update"}
        };
    };

    if(data.name !== undefined) {
        if(typeof data.name !== 'string') {
            errors.name = 'Name must be a string!';
        }
        else if(data.name.length === 0) {
            errors.name = 'Name cannot be empty'
        }
        else if(data.name.length > 100) {
            errors.name = 'Name must be less than 100 characters';
        }
    }
    
    if(data.email !== undefined) {
        if(typeof data.email !== 'string') {
            errors.email = 'Email cannot be empty'
        }else if(data.email.length === 0) {
            errors.email = 'Email must be a string!';
        }else if(!data.email.includes('@')) {
            errors.email = 'Invalid Email!';
        }
    }

    if(data.password !== undefined) {
        if(typeof data.password !== 'string') {
            errors.password = 'Password cannot be empty'
        }else if(data.password.length === 0) {
            errors.password = 'Password must be a string!';
        }else if(data.password.length < 8) {
            errors.password = 'Password should be atleast 8 characters';
        }else if(data.password.length > 50) {
            errors.password = 'Password must be less than 51 characters';
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0, errors
    };
}