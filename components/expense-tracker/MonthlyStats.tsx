'use client'

import { useMemo } from 'react'
import { Expense } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MonthlyStatsProps {
  expenses: Expense[]
}

export function MonthlyStats({ expenses }: MonthlyStatsProps) {
  const stats = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const monthlyExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      )
    })

    const total = monthlyExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    )

    const byCategory = monthlyExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)

    const topCategory = Object.entries(byCategory).sort(
      ([, a], [, b]) => b - a
    )[0]

    return {
      total,
      count: monthlyExpenses.length,
      topCategory: topCategory
        ? { name: topCategory[0], amount: topCategory[1] }
        : null,
      monthName: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    }
  }, [expenses])

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Summary - {stats.monthName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold text-primary">
              {formatAmount(stats.total)}
            </p>
          </div>

          <div className="p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold">{stats.count}</p>
          </div>

          <div className="p-4 bg-accent/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Top Category</p>
            <p className="text-2xl font-bold">
              {stats.topCategory ? (
                <span className="text-base">
                  {stats.topCategory.name}
                  <br />
                  <span className="text-sm text-muted-foreground">
                    {formatAmount(stats.topCategory.amount)}
                  </span>
                </span>
              ) : (
                <span className="text-base">None</span>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
