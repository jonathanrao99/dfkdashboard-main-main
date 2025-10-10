import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Get or create vendor if provided
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

    // Get category ID if provided
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

    // Prepare update data
    const updateData: any = {}
    if (body.date) updateData.txn_date = body.date
    if (body.amount !== undefined) updateData.amount = -Math.abs(body.amount) // Negative for expenses
    if (body.description !== undefined) updateData.description = body.description
    if (vendorId !== null) updateData.vendor_id = vendorId
    if (categoryId !== null) updateData.category_id = categoryId
    if (body.receiptUrl !== undefined) updateData.receipt_url = body.receiptUrl

    // Update the transaction
    const { data: updatedTransaction, error } = await supabaseAdmin
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .eq('type', 'expense')
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
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Expense not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // Get vendor and category names
    const vendorName = vendorId ? (await supabaseAdmin.from('vendors').select('name').eq('id', vendorId).single()).data?.name || 'Unknown' : 'Unknown'
    const categoryName = categoryId ? (await supabaseAdmin.from('categories').select('name').eq('id', categoryId).single()).data?.name || 'Uncategorized' : 'Uncategorized'

    // Transform for frontend
    const transformedExpense = {
      id: updatedTransaction.id,
      date: updatedTransaction.txn_date,
      vendor: vendorName,
      category: categoryName,
      description: updatedTransaction.description || '',
      amount: Math.abs(updatedTransaction.amount),
      receipt: !!updatedTransaction.receipt_url,
      receiptUrl: updatedTransaction.receipt_url,
      createdAt: updatedTransaction.created_at
    }

    return NextResponse.json({
      success: true,
      data: transformedExpense,
      message: 'Expense updated successfully'
    })
  } catch (error) {
    console.error('Error updating expense:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update expense' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Delete the transaction
    const { error } = await supabaseAdmin
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('type', 'expense')

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Expense not found' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Expense deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting expense:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete expense' },
      { status: 500 }
    )
  }
}
