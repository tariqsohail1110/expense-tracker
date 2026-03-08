import { CreateUserRequestDto } from "../modules/users/dtos/create-user-request.dto.js";

export const validateCreateUserDto = (data) => {
    const errors = {}
    Object.keys(CreateUserRequestDto).forEach(field => {
        if(!data[field]) {
            errors[field] = `${field} is required`;
        }
    })
    if(typeof data.name !== 'string') {
        errors.name = 'Name must be a string!';
    }else if(data.name.length > 100) {
        errors.name = 'Name must be less than 100 characters';
    }

    if(typeof data.email !== 'string') {
        errors.email = 'Email must be a string!';
    }else if(!data.email.includes('@')) {
        errors.email = 'Invalid Email!';
    }

    if(typeof data.password !== 'string') {
        errors.password = 'Password must be a string!';
    }else if(data.password.length < 8) {
        errors.password = 'Password should be atleast 8 characters';
    }else if(data.password.length > 50) {
        errors.password = 'Password must be less than 51 characters';
    }
    return {
        isValid: Object.keys(errors).length === 0, errors
    };
}