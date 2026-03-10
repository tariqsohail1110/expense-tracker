import { ExpenseService } from "../services/expense.service.js";
import { ExpenseResponseDto } from "../dtos/expense-response.dto.js";

export class ExpenseController {
    constructor() {
        this.expenseService = new ExpenseService();
        this.getAllExpenses = this.getAllExpenses.bind(this);
        this.getExpenseById = this.getExpenseById.bind(this);
        this.createExpense = this.createExpense.bind(this);
        this.updateExpense = this.updateExpense.bind(this);
        this.deleteExpense = this.deleteExpense.bind(this);
    }

    getAllExpenses = (req, res) => {
        try {
            const { userId } = req.params;
            const expenses = this.expenseService.getAllExpenses(userId);
            res.status(200).json({ data: expenses.map(expense => ExpenseResponseDto(expense)) });
        }catch(error) {
            res.status(500).json({ message: error.message });
        }
    }

    getExpenseById = async (req, res) => {
        try {
            const { id } = req.params;
            const { userId } = req.body;
            const expense = await this.expenseService.getExpenseById(id, userId);
            res.status(200).json({ data: ExpenseResponseDto(expense) });
        }catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    createExpense = async (req, res) => {
        try {
            const { userId } = req.body;
            const data = req.body;
            const expense = await this.expenseService.createExpense(userId, data);
            res.status(201).json({ data: ExpenseResponseDto(expense) });
        }catch(error) {
            res.status(400).json({ message: error.message });
        }
    }

    updateExpense = async (req, res) => {
        try {
            const { id } = req.params;
            const { userId } = req.body;
            const data = req.body;
            const expense = await this.updateExpense(id, userId, data);
            res.status(201).json({ data: ExpenseResponseDto(expense) });
        }catch(error) {
            res.status(400).json({ message: error.message });
        }
    }

    deleteExpense = async (req, res) => {
        try {
            const { id } = req.params;
            const{ userId } = req.body;
            await this.expenseService.deleteExpense(id, userId);
            res.status(200).json({ message: "Expense deleted successfully!" });
        }catch(error) {
            res.status(400).json({ message: error.message });
        }
    }
}