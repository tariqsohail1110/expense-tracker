export const ExpenseResponseDto = (expense) => ({
    id: expense.id,
    userId: expense.user_id,
    title: expense.title,
    amount: expense.amount,
    category: expense.category,
    date: expense.date,
    createdAt: expense.created_at
})