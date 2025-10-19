import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createExpenseSchema } from '@/lib/validations'
import { z } from 'zod'

// GET /api/expenses - Get all expenses with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}

    if (category && category !== 'all') {
      where.category = category
    }

    if (startDate || endDate) {
      where.date = {}
      if (startDate) {
        where.date.gte = new Date(startDate)
      }
      if (endDate) {
        where.date.lte = new Date(endDate)
      }
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}

// POST /api/expenses - Create a new expense
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = createExpenseSchema.parse(body)

    const expense = await prisma.expense.create({
      data: {
        amount: data.amount,
        category: data.category,
        date: new Date(data.date),
        description: data.description,
      },
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating expense:', error)
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    )
  }
}
