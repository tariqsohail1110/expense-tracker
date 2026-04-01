import { OtpPurpose } from "../../../common/enums/enums.js";import { SendOtpDto } from '../../modules/otp/dtos/send-otp.dto.js'

export const validateSendOtpDto = (data) => {
    const errors = {}
    Object.keys(SendOtpDto).forEach(field => {
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

    if(!Object.values(OtpPurpose).includes(purpose)) {
        errors.purpose = 'Invlaid otp purpose';
    }
}