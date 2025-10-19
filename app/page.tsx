'use client'

import { useState, useEffect } from 'react'
import { Expense } from '@/types'
import { AddExpenseForm } from '@/components/expense-tracker/AddExpenseForm'
import { ExpenseList } from '@/components/expense-tracker/ExpenseList'
import { ExpenseFilters } from '@/components/expense-tracker/ExpenseFilters'
import { MonthlyStats } from '@/components/expense-tracker/MonthlyStats'

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [category, setCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  const fetchExpenses = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (category !== 'all') {
        params.append('category', category)
      }

      const response = await fetch(`/api/expenses?${params}`)
      if (!response.ok) throw new Error('Failed to fetch expenses')

      const data = await response.json()
      setExpenses(data)
      setFilteredExpenses(data)
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  const handleExpenseAdded = () => {
    fetchExpenses()
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Expense Tracker</h1>
          <p className="text-muted-foreground">
            Track your expenses and manage your budget efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Add Expense Form */}
          <div className="lg:col-span-1 space-y-6">
            <AddExpenseForm onExpenseAdded={handleExpenseAdded} />
            <ExpenseFilters
              category={category}
              onCategoryChange={setCategory}
            />
          </div>

          {/* Right Column - Stats and List */}
          <div className="lg:col-span-2 space-y-6">
            <MonthlyStats expenses={expenses} />

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading expenses...</p>
              </div>
            ) : (
              <ExpenseList expenses={filteredExpenses} />
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
