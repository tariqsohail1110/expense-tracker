export const validateCreateBudgetDto = (data) => {
    const errors = {};

    if(!data || data.totalBudget === undefined) {
        errors.totalBudget = 'Budget is required';
    }else if(typeof data.totalBudget !== 'number') {
        errors.totalBudget = 'Budget must be a numeric value';
    }else if(data.totalBudget < 1) {
        errors.totalBudget = 'Budget cannot be zero or less than zero';
    }else if(data.totalBudget.toString().length > 10) {
        errors.totalBudget = 'Budget should be less than 11 characters';
    }

    return {
        isValid: Object.keys(errors).length === 0, errors
    };
}