import { notFound } from "../../../common/errors/not-exist.error.js";
import { validateIntegerValues } from "../../../common/errors/validate-integer values.error.js";
import { BudgetRepository } from "../../budget/repositories/budget.repository.js";
import { BudgetService } from "../../budget/services/budget.service.js";
import { UserRepository } from "../../users/repositories/user.repository.js";
import { ExpenseRepository } from "../repositories/expense.repository.js";

export class ExpenseService {
    constructor() {
        this.expenseRepository = new ExpenseRepository();
        this.userRepository = new UserRepository();
        this.budgetService =  new BudgetService();
        this.budgetRepository = new BudgetRepository();
    }

    async getAllExpenses(userId) {
        try {
            const parseId = Number(userId);
            validateIntegerValues(parseId, 'User ID');
            const user = await this.userRepository.getById(parseId);
            if(!user) {
                return notFound(user, "User");
            }
            return await this.expenseRepository.getAll(parseId);
        }catch(error) {
            throw error;
        }
    }

    async getExpenseById(id, userId) {
        try {
            const parseId = Number(id);
            const parseUserId = Number(userId);
            validateIntegerValues(parseId, 'Expense ID');
            validateIntegerValues(parseUserId, 'User ID');
            const user = await this.userRepository.getById(parseUserId);
            notFound(user, 'User');
            const expense = await this.expenseRepository.getById(parseId, parseUserId);
            notFound(expense, 'Expense');
            return expense;
        }catch(error) {
            throw error;
        }
    }

    async createExpense(userId, data) {
        try {
            const parseId = Number(userId);
            validateIntegerValues(parseId, 'User');
            const { title, amount, category, date, note } = data;
            const budget = await this.budgetRepository.getBudgetByUserId(parseId);
            if(!budget || budget === undefined) {
                throw new Error('No budget found, please define your budget');
            }
            const parsedRem = parseFloat(budget.remaining_budget);
            const remainingBudget = parsedRem - data.amount;
            if(remainingBudget < 0) {
                throw new Error('No negative balance allowed');
            }
            const newExpense = await this.expenseRepository.create(
                parseId,
                {
                    title,
                    amount,
                    category,
                    date,
                    note,
                }
            )
            await this.budgetService.updateBudgetFromExpense(parseId, remainingBudget);
            return newExpense;
        }catch(error) {
            throw error;
        }
    }

    async updateExpense(id, userId, data) {
        try {
            const parseId = Number(id);
            const parseUserId = Number(userId);
            validateIntegerValues(parseId, 'Expense ID');
            validateIntegerValues(parseUserId, 'User ID');
            const user = await this.userRepository.getById(parseUserId);
            notFound(user, "User");
            const existingExpense = await this.expenseRepository.getById(parseId, parseUserId);
            notFound(existingExpense, 'Expense');
            if(data.amount !== undefined) {
                const budget = await this.budgetRepository.getBudgetByUserId(parseUserId);
                const parsedRem = parseFloat(budget.remaining_budget);
                const parsedExp = parseFloat(existingExpense.amount);
                if(!budget || budget === undefined) {
                    throw new Error('No budget found, please define your budget');
                }
                let remainingBudget;
                if(data.amount > parsedExp) {
                    remainingBudget = parsedRem - (data.amount - parsedExp);
                    if(remainingBudget < 0) {
                        throw new Error('No negative balance allowed');
                    }
                }else {
                    remainingBudget = parsedRem + (parsedExp - data.amount);
                }
                await this.budgetService.updateBudgetFromExpense(parseUserId, remainingBudget);
            }
            return await this.expenseRepository.update(parseId, parseUserId, data);
        }catch(error) {
            throw error;
        }
    }

    async deleteExpense(id, userId) {
        try{
            const parseId = Number(id);
            const parseUserId = Number(userId);
            validateIntegerValues(parseId, 'Expense ID');
            validateIntegerValues(parseUserId, 'User ID');
            const user = await this.userRepository.getById(parseUserId);
            notFound(user, "User");
            const existingExpense = await this.expenseRepository.getById(parseId, parseUserId);
            notFound(existingExpense, 'Expense');
            const budget = await this.budgetRepository.getBudgetByUserId(parseUserId);
            const parsedRem = parseFloat(budget.remaining_budget);
            const parsedExp = parseFloat(existingExpense.amount);
            const updatedAmount = parsedRem + parsedExp;
            await this.budgetService.updateBudgetFromExpense(parseUserId, updatedAmount);
            return await this.expenseRepository.delete(parseId, parseUserId);
        }catch(error) {
            throw error;
        }
    }
}