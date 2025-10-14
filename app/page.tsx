import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect the root path to the main dashboard
  redirect('/dashboard')
}
