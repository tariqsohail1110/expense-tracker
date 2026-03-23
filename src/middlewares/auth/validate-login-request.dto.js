import { LoginRequestDto } from "../../modules/auth/dtos/login.dto.js"

export const valiateLoginRequestDto = (data) => {
    const errors = {}
    Object.keys(LoginRequestDto).forEach(field => {
        if(!data[field]) {
            errors[field] = `${field} is required`;
        }
    })
    if (typeof data.email !== 'string') {
        errors.email = 'Invalid Email';
    }else if(!data.email.includes("@")) {
        errors.email = 'Invalid Email';
    }

    if(typeof data.password !== 'string') {
        errors.password = 'Invalid Password';
    }else if(data.password.length < 8) {
        errors.password = 'Invalid Password';
    }
    return {
        isValid: Object.keys(errors).length === 0, errors
    };
}