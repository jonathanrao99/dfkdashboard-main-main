/**
 * Supabase Client Utilities
 * Provides admin and anon clients for database operations
 * Following PRD specifications - No Prisma, Supabase JS SDK only
 */

import { createClient } from '@supabase/supabase-js'

// As per PRD §18
export const admin = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SERVICE_ROLE_KEY!)
export const anon = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
