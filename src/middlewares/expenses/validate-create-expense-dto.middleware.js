import { CreateExpenseDto } from "../../modules/expenses/dtos/create-expense.dto.js"

export const validateCreateExpenseDto = (data) => {
    const errors = {}
    Object.keys(CreateExpenseDto).forEach(field => {
        if(!data[field]) {
            errors[field] = `${field} is required`;
        }
    })
    if(typeof data.title !== 'string') {
        errors.title = 'Title must be a string';
    }else if(data.title.length > 100) {
        errors.title = 'Title must be less than 100 characters';
    }

    if(typeof data.amount !== 'number') {
        errors.amount = 'Amount must be an Integer';
    }else if(data.amount < 1) {
        errors.amount = 'Amount should be greater than 0';
    }else if(data.amount.length > 50) {
        errors.amount = 'Invalid amount';
    }

    if(typeof data.category !== 'string') {
        errors.category = 'Category Must be string';
    }else if(data.category.length > 100) {
        errors.category = 'Category is too long';
    }

    if(typeof data.date !== 'string') {
        errors.date = 'Date must be String';
    }else if(data.date.length > 100) {
        errors.date = 'Date is too long';
    }
    return {
        isValid: Object.keys(errors).length === 0, errors
    };
}