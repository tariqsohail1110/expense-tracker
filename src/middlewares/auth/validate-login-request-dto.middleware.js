import { LoginRequestDto } from "../../modules/auth/dtos/login.dto.js"

export const validateLoginRequestDto = (data) => {
    const errors = {}
    const safeData = data && typeof data === "object" ? data : {};
    Object.keys(LoginRequestDto).forEach(field => {
        if(!safeData[field]) {
            errors[field] = `${field} is required`;
        }
    })
    if (typeof safeData.email !== 'string') {
        errors.email = 'Invalid Email';
    }else if(!safeData.email.includes("@")) {
        errors.email = 'Invalid Email';
    }

    if(typeof safeData.password !== 'string') {
        errors.password = 'Invalid Password';
    }else if(safeData.password.length < 8) {
        errors.password = 'Invalid Password';
    }
    return {
        isValid: Object.keys(errors).length === 0, errors
    };
}