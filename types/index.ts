// Expense types
export interface Expense {
  id: string
  amount: number
  category: string
  date: Date | string
  description: string | null
  createdAt: Date | string
  updatedAt: Date | string
}

export interface MonthlyTotal {
  month: string
  total: number
  count: number
}
