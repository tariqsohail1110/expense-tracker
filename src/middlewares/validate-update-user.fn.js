import { UpdateUserDto } from '../modules/users/dtos/update-user-request.dto.js'

export const validateUpdateUserDto = (data) => {
    const errors = {}
    Object.keys(UpdateUserDto).forEach(field => {
        if(!data[field]) {
            errors[field] = `${field} is required`
        }
    })
    if(typeof data.name !== String) {
        errors.name = 'Email must be a string!';
    }else if(data.name.lengh > 100) {
        errors.name = 'Name must be less than 100 characters';
    }

    if(typeof data.email !== String) {
        errors.email = 'Email must be a string!';
    }else if(!data.email.includes('@')) {
        errors.email = 'Invalid Email!';
    }

    if(typeof data.password !== String) {
        errors.password = 'Password must be a string!';
    }else if(data.password.lengh < 8) {
        errors.password = 'Password should be atleast 8 characters';
    }return {
        isValid: Object.keys(errors).length === 0, errors
    };
}