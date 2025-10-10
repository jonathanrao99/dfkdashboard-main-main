import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build query
    let query = supabaseAdmin
      .from('transactions')
      .select(`
        id,
        txn_date,
        amount,
        description,
        receipt_url,
        created_at,
        vendor_id,
        category_id
      `)
      .eq('type', 'expense')
      .order('txn_date', { ascending: false })

    // Apply filters
    if (startDate) {
      query = query.gte('txn_date', startDate)
    }

    if (endDate) {
      query = query.lte('txn_date', endDate)
    }

    const { data: expenses, error } = await query

    if (error) {
      throw error
    }

    // Get vendor and category names separately
    const vendorIds = Array.from(new Set(expenses?.map(e => e.vendor_id).filter(Boolean) || []))
    const categoryIds = Array.from(new Set(expenses?.map(e => e.category_id).filter(Boolean) || []))

    const { data: vendors } = await supabaseAdmin
      .from('vendors')
      .select('id, name')
      .in('id', vendorIds)

    const { data: categories } = await supabaseAdmin
      .from('categories')
      .select('id, name')
      .in('id', categoryIds)

    const vendorMap = new Map(vendors?.map(v => [v.id, v.name]) || [])
    const categoryMap = new Map(categories?.map(c => [c.id, c.name]) || [])

    // Transform data for frontend
    const transformedExpenses = expenses?.map(expense => ({
      id: expense.id,
      date: expense.txn_date,
      vendor: vendorMap.get(expense.vendor_id) || 'Unknown',
      category: categoryMap.get(expense.category_id) || 'Uncategorized',
      description: expense.description || '',
      amount: Math.abs(expense.amount), // Convert negative to positive for display
      receipt: !!expense.receipt_url,
      receiptUrl: expense.receipt_url,
      createdAt: expense.created_at
    })) || []

    // Apply category filter after transformation
    const filteredExpenses = category && category !== 'all' 
      ? transformedExpenses.filter(expense => 
          expense.category.toLowerCase().includes(category.toLowerCase())
        )
      : transformedExpenses

    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    return NextResponse.json({
      success: true,
      data: filteredExpenses,
      total: filteredExpenses.length,
      totalAmount
    })
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // First, get or create vendor
    let vendorId = null
    if (body.vendor) {
      const { data: existingVendor } = await supabaseAdmin
        .from('vendors')
        .select('id')
        .eq('name', body.vendor)
        .single()

      if (existingVendor) {
        vendorId = existingVendor.id
      } else {
        const { data: newVendor, error: vendorError } = await supabaseAdmin
          .from('vendors')
          .insert({ name: body.vendor })
          .select('id')
          .single()

        if (vendorError) throw vendorError
        vendorId = newVendor.id
      }
    }

    // Get category ID
    let categoryId = null
    if (body.category) {
      const { data: category } = await supabaseAdmin
        .from('categories')
        .select('id')
        .eq('name', body.category)
        .single()

      if (category) {
        categoryId = category.id
      }
    }

    // Get default account ID (assuming first bank account)
    const { data: account } = await supabaseAdmin
      .from('accounts')
      .select('id')
      .eq('type', 'bank')
      .single()

    if (!account) {
      throw new Error('No bank account found')
    }

    // Create transaction
    const { data: newTransaction, error } = await supabaseAdmin
      .from('transactions')
      .insert({
        account_id: account.id,
        txn_date: body.date,
        amount: -Math.abs(body.amount), // Negative for expenses
        type: 'expense',
        description: body.description,
        vendor_id: vendorId,
        category_id: categoryId,
        receipt_url: body.receiptUrl
      })
      .select(`
        id,
        txn_date,
        amount,
        description,
        receipt_url,
        created_at,
        vendors(name),
        categories(name)
      `)
      .single()

    if (error) {
      throw error
    }

    // Get vendor and category names
    const vendorName = vendorId ? (await supabaseAdmin.from('vendors').select('name').eq('id', vendorId).single()).data?.name || 'Unknown' : 'Unknown'
    const categoryName = categoryId ? (await supabaseAdmin.from('categories').select('name').eq('id', categoryId).single()).data?.name || 'Uncategorized' : 'Uncategorized'

    // Transform for frontend
    const transformedExpense = {
      id: newTransaction.id,
      date: newTransaction.txn_date,
      vendor: vendorName,
      category: categoryName,
      description: newTransaction.description || '',
      amount: Math.abs(newTransaction.amount),
      receipt: !!newTransaction.receipt_url,
      receiptUrl: newTransaction.receipt_url,
      createdAt: newTransaction.created_at
    }

    return NextResponse.json({
      success: true,
      data: transformedExpense,
      message: 'Expense created successfully'
    })
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create expense' },
      { status: 500 }
    )
  }
}