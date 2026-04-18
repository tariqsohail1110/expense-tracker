export const validateUpdateBudgetDto = (data) => {
    const errors = {};

    if(!data || Object.keys(data).length === 0) {
        return {
            isValid: false,
            errors: { message: 'Total Budget is required'}
        };
    }

    if(data.totalBudget !== undefined) {
        if(typeof data.totalBudget !== 'number') {
            errors.totalBudget = 'Budget must be a numeric value';
        }else if(data.totalBudget < 1) {
            errors.totalBudget = 'Budget cannot be zero or less than zero';
        }else if(data.totalBudget.length > 10) {
            errors.totalBudget = 'Budget should be less than 11 characters';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0, errors
    };
}