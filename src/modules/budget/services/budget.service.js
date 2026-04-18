import { notFound } from "../../../common/errors/not-exist.error.js";
import { validateIntegerValues } from "../../../common/errors/validate-integer values.error.js";
import { UserRepository } from "../../users/repositories/user.repository.js";
import { BudgetRepository } from "../repositories/budget.repository.js";

export class BudgetService {
    constructor() {
        this.budgetRepository =  new BudgetRepository();
        this.userRepository = new UserRepository();
    }

    async getBudgetByUserId(userId) {
        try {
            const parseUserId = Number(userId);
            validateIntegerValues(parseUserId, 'User ID');
            const user = await this.userRepository.getById(parseUserId);
            notFound(user, 'User');
            const budget = await this.budgetRepository.getBudgetByUserId(parseUserId);
            notFound(budget, "Budget");
            return budget;
        }catch(error) {
            throw error;
        }
    }

    async createBudget(userId, totalBudget) {
        try {
            const parseUserId = Number(userId);
            validateIntegerValues(parseUserId, "User ID");
            const user = await this.userRepository.getById(parseUserId);
            notFound(user, 'User');
            const existingBudget = await this.budgetRepository.getBudgetByUserId(parseUserId);
            if(existingBudget !== undefined) {
                throw new Error('Budget already exists, can not create a new one');
            }
            const data = { totalBudget, remainingBudget: totalBudget };
            const budget = await this.budgetRepository.createBudget(parseUserId, data);
            return budget;
        }
        catch(error) {
            throw error;
        }
    }

    async updateMyBudget(userId, totalBudget) {
        try {
            const budget = await this.getBudgetByUserId(userId);
            const parsedTotal = parseFloat(budget.total_budget);
            const parsedRem = parseFloat(budget.remaining_budget);
            const newTotal = parsedTotal + totalBudget;
            const newRemBudget = parsedRem + totalBudget;
            const data = { totalBudget: newTotal, remainingBudget: newRemBudget };
            const updatedBudget = await this.budgetRepository.updateMyBudget(budget.user_id, data);
            return updatedBudget;
        }catch(error) {
            throw error;
        }
    }

    async updateBudgetFromExpense(userId, remainingBudget) {
        try {
            const budget = await this.getBudgetByUserId(userId);
            const updatedBudget = await this.budgetRepository.updateBudget(budget.user_id, remainingBudget);
            return updatedBudget;
        }catch(error) {
            throw error;
        }
    }

    async deleteBudget(userId) {
        try {
            const budget = await this.getBudgetByUserId(userId);
            const deletedBudget = await this.budgetRepository.deleteBudget(budget.user_id);
            return deletedBudget;
        }catch(error) {
            throw error;
        }
    }
}