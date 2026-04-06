import { ForgetPasswordDto } from "../../modules/auth/dtos/forget-password.dto.js";

export const validateForgetPasswordDto = (data) => {
    const errors = {}
    const safeData = data && typeof data === "object" ? data : {};
    Object.keys(ForgetPasswordDto).forEach(field => {
        if(!safeData[field]) {
            errors[field] = `${field} is required`;
        }
    })
    if (typeof safeData.email !== 'string') {
        errors.email = 'Invalid Email';
    }else if(!safeData.email.includes("@")) {
        errors.email = 'Invalid Email';
    }

    return {
        isValid: Object.keys(errors).length === 0, errors
    };
}