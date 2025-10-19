import { z } from "zod"

// Expense validation schemas
export const createExpenseSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().or(z.date()),
  description: z.string().optional(),
})

export const expenseFilterSchema = z.object({
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>
export type ExpenseFilterInput = z.infer<typeof expenseFilterSchema>
