import { BudgetResponseDto } from "../dtos/budget-response.dto.js";
import { BudgetService } from "../services/budget.service.js";

export class BudgetController {
    constructor() {
        this.budgetService = new BudgetService();
    }

    getBudgetByUserId = async (req, res) => {
        try {
            const userId = req.user.sub;
            const budget = await this.budgetService.getBudgetByUserId(userId);
            res.status(200).json({ data: BudgetResponseDto(budget) });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 404;
            res.status(statusCode).json({ message: error.message });
        }
    }

    createBudget = async (req, res) => {
        try {
            const userId = req.user.sub;
            const { totalBudget } = req.body;
            const budget = await this.budgetService.createBudget(userId, totalBudget);
            res.status(201).json({ data: BudgetResponseDto(budget) });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }

    updateMyBudget = async (req, res) => {
        try {
            const userId = req.user.sub;
            const { totalBudget } = req.body;
            const budget = await this.budgetService.updateMyBudget(userId, totalBudget);
            res.status(200).json({ data: BudgetResponseDto(budget) });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }

    deleteBudget = async (req, res) => {
        try {
            const userId = req.user.sub;
            await this.budgetService.deleteBudget(userId);
            res.status(200).json({ message: 'Budget deleted successfully' });
        }catch(error) {
            const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 400;
            res.status(statusCode).json({ message: error.message });
        }
    }
}