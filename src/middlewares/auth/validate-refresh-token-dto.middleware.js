import { RefreshTokenDto } from "../../modules/auth/dtos/refreshToken.dto.js"

export const validateRefreshTokenDto = (data) => {
    const errors = {}
    if(!data.refreshToken) {
        errors.refreshToken = 'No token provided';
    }else if(data.refreshToken && typeof data.refreshToken !== 'string') {
        errors.refreshToken = 'Invalid Token';
    }
    return {
        isValid: Object.keys(errors).length === 0, errors
    };
}