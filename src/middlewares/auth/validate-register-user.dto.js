import { RegisterUserDto } from "../../modules/auth/dtos/regiter-user.dto.js";

export const validateRegisterUserDto = (data) => {
    const errors = {}
    Object.keys(RegisterUserDto).forEach(field => {
        if(!data[field]) {
            errors[field] = `${field} is required`;
        }
    })
    //name
    if(typeof data.name !== 'string') {
        errors.name = 'Name must be a string!';
    }else if(data.name.length > 100) {
        errors.name = 'Name must be less than 100 characters';
    }

    //email
    if(typeof data.email !== 'string') {
        errors.email = 'Email must be a string!';
    }else if(!data.email.includes('@')) {
        errors.email = 'Invalid Email!';
    }

    //password
    if(typeof data.password !== 'string') {
        errors.password = 'Password must be a string!';
    }else if(data.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
    }else if(data.password.length > 50) {
        errors.password = 'Password must be less than 51 characters';
    }else if(!/[a-z]/.test(data.password)) {
        errors.password = 'Password must contain at least one lowercase character';
    }else if(!/[A-Z]/.test(data.password)) {
        errors.password = 'Password must contain at least one uppercase character';
    }else if(!/[0-9]/.test(data.password)) {
        errors.password = 'Password must contain at least one number';
    }else if(!/[^a-zA-Z0-9]/.test(data.password)) {
        errors.password = 'Password must contain at least one special character';
    }

    return {
        isValid: Object.keys(errors).length === 0, errors
    };
}