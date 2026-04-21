import { notFound } from "../../../common/errors/not-exist.error.js";
import { validateIntegerValues } from "../../../common/errors/validate-integer values.error.js";
import { UserRepository } from "../../users/repositories/user.repository.js";
import { ExpenseRepository } from "../repositories/expense.repository.js";
import excelJs from 'exceljs';

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

    async exportExpensesXlsx(userId) {
        try {
            const expenses = await this.getAllExpenses(userId);
            const workbook = new excelJs.Workbook();
            const worksheet = workbook.addWorksheet('My Expenses');
            worksheet.columns = [
                { header: 'S.No', key: 's_no', width: 10 },
                { header: 'Title', key: 'title', width: 20 },
                { header: 'Amount', key: 'amount', width: 25 },
                { header: 'Category', key: 'category', width: 20 },
                { header: 'Date', key: 'date', width: 20 },
                { header: 'Note', key: 'note', width: 70 },
            ];
            let count = 1;
            expenses.forEach((expense) => {
                expense.s_no = count;
                worksheet.addRow(expense);
                count++;
            });
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });
            const buffer = await workbook.xlsx.writeBuffer('expenses.xlsx');
            return buffer;
        }catch (error) {
            throw error;
        }
    }
}