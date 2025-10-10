import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // Build query with spend calculation
    let query = supabaseAdmin
      .from('vendors')
      .select(`
        id,
        name,
        created_at,
        default_category,
        transactions!inner(
          amount,
          txn_date
        )
      `)

    // Apply search filter
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const { data: vendors, error } = await query

    if (error) {
      throw error
    }

    // Get category names
    const categoryIds = Array.from(new Set(vendors?.map(v => v.default_category).filter(Boolean) || []))
    const { data: categoryData } = await supabaseAdmin
      .from('categories')
      .select('id, name')
      .in('id', categoryIds)

    const categoryMap = new Map(categoryData?.map(c => [c.id, c.name]) || [])

    // Calculate monthly spend for each vendor
    const currentMonth = new Date()
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    const transformedVendors = vendors?.map(vendor => {
      // Calculate monthly spend from transactions
      const monthlySpend = vendor.transactions
        ?.filter(txn => {
          const txnDate = new Date(txn.txn_date)
          return txnDate >= startOfMonth && txnDate <= endOfMonth && txn.amount < 0
        })
        ?.reduce((sum, txn) => sum + Math.abs(txn.amount), 0) || 0

      // Get last order date
      const lastOrder = vendor.transactions
        ?.filter(txn => txn.amount < 0)
        ?.sort((a, b) => new Date(b.txn_date).getTime() - new Date(a.txn_date).getTime())[0]
        ?.txn_date

      return {
        id: vendor.id,
        name: vendor.name,
        category: categoryMap.get(vendor.default_category) || 'Uncategorized',
        monthlySpend: Math.round(monthlySpend * 100) / 100,
        lastOrder: lastOrder ? new Date(lastOrder).toISOString().split('T')[0] : null,
        status: 'active',
        rating: 4.5, // Default rating - could be calculated from reviews
        paymentTerms: 'Net 30', // Default - could be stored in vendor table
        createdAt: vendor.created_at
      }
    }) || []

    // Apply category filter after transformation
    const filteredVendors = category && category !== 'all' 
      ? transformedVendors.filter(vendor => 
          vendor.category.toLowerCase().includes(category.toLowerCase())
        )
      : transformedVendors

    // Sort by monthly spend descending
    filteredVendors.sort((a, b) => b.monthlySpend - a.monthlySpend)

    const totalSpend = filteredVendors.reduce((sum, vendor) => sum + vendor.monthlySpend, 0)

    // Get unique categories
    const categories = Array.from(new Set(filteredVendors.map(v => v.category)))

    return NextResponse.json({
      success: true,
      data: filteredVendors,
      total: filteredVendors.length,
      totalSpend,
      categories
    })
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vendors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
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

    // Create vendor
    const { data: newVendor, error } = await supabaseAdmin
      .from('vendors')
      .insert({
        name: body.name,
        default_category: categoryId
      })
      .select(`
        id,
        name,
        created_at,
        default_category
      `)
      .single()

    if (error) {
      throw error
    }

    // Get category name
    const categoryName = categoryId ? (await supabaseAdmin.from('categories').select('name').eq('id', categoryId).single()).data?.name || 'Uncategorized' : 'Uncategorized'

    // Transform for frontend
    const transformedVendor = {
      id: newVendor.id,
      name: newVendor.name,
      category: categoryName,
      monthlySpend: 0,
      lastOrder: null,
      status: 'active',
      rating: 4.5,
      paymentTerms: 'Net 30',
      createdAt: newVendor.created_at
    }

    return NextResponse.json({
      success: true,
      data: transformedVendor,
      message: 'Vendor created successfully'
    })
  } catch (error) {
    console.error('Error creating vendor:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create vendor' },
      { status: 500 }
    )
  }
}