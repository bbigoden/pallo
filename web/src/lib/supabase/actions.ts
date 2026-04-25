'use server'

import { redirect } from 'next/navigation'
import { createClient } from './server'

export async function login(email: string, password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  redirect('/dashboard')
}

export async function register(data: {
  email: string
  password: string
  name: string
  phone: string
  role: 'borrower' | 'lender'
}) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { name: data.name, phone: data.phone, role: data.role },
    },
  })
  if (error) throw new Error(error.message)
  redirect(data.role === 'lender' ? '/dashboard?welcome=lender' : '/dashboard?welcome=borrower')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function getSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return data
}
