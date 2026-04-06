import { VerifyOtpDto } from '../../modules/otp/dtos/verify-otp.dto.js'

export const validateVerifyOtpDto = (data) => {
    const errors = {};
    Object.keys(VerifyOtpDto).forEach(field => {
        if(!data[field]) {
            errors[field] = `${field} is required`;
        }
    })

    //email
    if(typeof data.email !== 'string') {
        errors.email = 'Invalid Email'
    }else if(data.email.length > 100) {
        errors.email = 'Email shoulf be less than 100 characters';
    }else if(!data.email.includes('@')) {
        errors.email = 'Invalid Email';
    }

    //code
    if(typeof data.code !== 'string') {
        errors.code = 'Invalid otp';
    }else if(data.code.length !== 6) {
        errors.code = 'Code must be of 6 digits';
    }

    return {
        isValid: Object.keys(errors).length === 0, errors
    };
}