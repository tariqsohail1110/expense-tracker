export const BudgetResponseDto = (budget) => ({
    userId: budget.user_id,
    totalBudget: budget.total_budget,
    remainingBudget: budget.remaining_budget,
})