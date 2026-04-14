import { ExpenseService } from "../services/expense.service.js";
import { ExpenseResponseDto } from "../dtos/expense-response.dto.js";

export class ExpenseController {
    constructor() {
        this.expenseService = new ExpenseService();
    }

    getAllExpenses = async (req, res) => {
        try {
            const { userId } = req.params;
            const expenses = await this.expenseService.getAllExpenses(userId);
            // console.log('expenses: ', expenses);
            res.status(200).json({ data: expenses.map(expense => ExpenseResponseDto(expense)) });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
            res.status(statusCode).json({ message: error.message });
        }
    }

    getAllOwnExpenses = async (req, res) => {
        try {
            const userId  = req.user.sub;
            const expenses = await this.expenseService.getAllExpenses(userId);
            // console.log('expenses: ', expenses);
            res.status(200).json({ data: expenses.map(expense => ExpenseResponseDto(expense)) });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
            res.status(statusCode).json({ message: error.message });
        }
    }

    getExpenseById = async (req, res) => {
        try {
            const { id } = req.params;
            const { user_id } = req.query;
            // console.log("userID: ", user_id);
            const expense = await this.expenseService.getExpenseById(id, user_id);
            res.status(200).json({ data: ExpenseResponseDto(expense) });
        }catch (error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 404;
            res.status(statusCode).json({ message: error.message });
        }
    }

    getOwnExpenseById = async (req, res) => {
        try {
            const { id } = req.params;
            const user_id = req.user.sub;
            // console.log("userID: ", user_id);
            const expense = await this.expenseService.getExpenseById(id, user_id);
            res.status(200).json({ data: ExpenseResponseDto(expense) });
        }catch (error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 404;
            res.status(statusCode).json({ message: error.message });
        }
    }

    createExpense = async (req, res) => {
        try {
            const user_id = req.user.sub;
            const { ...data } = req.body;
            const expense = await this.expenseService.createExpense(user_id, data);
            res.status(201).json({ data: ExpenseResponseDto(expense) });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }

    updateExpense = async (req, res) => {
        try {
            const { id } = req.params;
            const user_id = req.user.sub;
            const { ...data } = req.body;
            const expense = await this.expenseService.updateExpense(id, user_id, data);
            res.status(201).json({ data: ExpenseResponseDto(expense) });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }

    deleteExpense = async (req, res) => {
        try {
            const { id } = req.params;
            const user_id = req.user.sub;
            console.log("userID: ", user_id);
            await this.expenseService.deleteExpense(id, user_id);
            res.status(200).json({ message: "Expense deleted successfully!" });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }
}