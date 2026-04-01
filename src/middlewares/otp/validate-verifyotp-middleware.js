import { OtpPurpose } from "../../../common/enums/enums.js";import { VerifyOtpDto } from '../../modules/otp/dtos/verify-otp.dto.js'

export const validateSendOtpDto = (data) => {
    const errors = {}
    Object.keys(VerifyOtpDto).forEach(field => {
        if(!data[field]) {
            errors[field] = `${field} is required`;
        }
    })
    
    if(typeof data.email !== 'string') {
        errors.email = 'Invalid Email'
    }
    if(data.email.length > 100) {
        errors.email = 'Email shoulf be less than 100 characters';
    }
    if(!data.email.includes('@')) {
        errors.email = 'Invalid Email';
    }

    if(typeof data.code !== 'string') {
        errors.code = 'Invalid otp';
    }
    if(data.code.length > 6) {
        errors.code = 'Invalid otp';
    }

    if(!Object.values(OtpPurpose).includes(purpose)) {
        errors.purpose = 'Invlaid otp purpose';
    }
}