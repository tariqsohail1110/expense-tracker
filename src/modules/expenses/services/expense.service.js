import { notFound } from "../../../common/errors/not-exist.error.js";
import { validateIntegerValues } from "../../../common/errors/validate-integer values.error.js";
import { UserRepository } from "../../users/repositories/user.repository.js";
import { ExpenseRepository } from "../repositories/expense.repository.js";

export class ExpenseService {
    constructor() {
        this.expenseRepository = new ExpenseRepository();
        this.userRepository = new UserRepository();
    }

    async getAllExpenses(userId) {
        const parseId = Number(userId);
        validateIntegerValues(parseId, 'User ID');
        const user = await this.userRepository.getById(parseId);
        if(!user) {
            return notFound(user, "User");
        }
        return await this.expenseRepository.getAll(parseId);
    }

    async getExpenseById(id, userId) {
        const parseId = Number(id);
        const parseUserId = Number(userId);
        validateIntegerValues(parseId, 'Expense ID');
        validateIntegerValues(parseUserId, 'User ID');
        const user = await this.userRepository.getById(parseUserId);
        notFound(user, 'User');
        const expense = await this.expenseRepository.getById(parseId, parseUserId);
        notFound(expense, 'Expense');
        return expense;
    }

    async createExpense(userId, data) {
        const parseId = Number(userId);
        validateIntegerValues(parseId, 'User');
        const { title, amount, category, date, note } = data;
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
        return newExpense;
    }

    async updateExpense(id, userId, data) {
        const parseId = Number(id);
        const parseUserId = Number(userId);
        validateIntegerValues(parseId, 'Expense ID');
        validateIntegerValues(parseUserId, 'User ID');
        const user = await this.userRepository.getById(parseUserId);
        notFound(user, "User");
        const existingExpense = await this.expenseRepository.getById(parseId, parseUserId);
        notFound(existingExpense, 'Expense');
        return await this.expenseRepository.update(parseId, parseUserId, data);
    }

    async deleteExpense(id, userId) {
        const parseId = Number(id);
        const parseUserId = Number(userId);
        validateIntegerValues(parseId, 'Expense ID');
        validateIntegerValues(parseUserId, 'User ID');
        const user = await this.userRepository.getById(parseUserId);
        notFound(user, "User");
        const existingExpense = await this.expenseRepository.getById(parseId, parseUserId);
        notFound(existingExpense, 'Expense');
        return await this.expenseRepository.delete(parseId, parseUserId);
    }
}