'use client'

import { Expense } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ExpenseListProps {
  expenses: Expense[]
}

export function ExpenseList({ expenses }: ExpenseListProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No expenses found. Add your first expense above!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">
                        {formatAmount(expense.amount)}
                      </span>
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {expense.category}
                      </span>
                    </div>
                    {expense.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {expense.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(expense.date)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
