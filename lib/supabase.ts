import { createClient } from "@supabase/supabase-js"

// 🔗 更新Supabase連接資訊
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://agevaqohgvuscycmbygm.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnZXZhcW9oZ3Z1c2N5Y21ieWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzc0MzksImV4cCI6MjA2ODkxMzQzOX0.Av3F9MZ51Yfq86hor1ky_ZmjeogttmtwJgZUj7mu6Ys"

// Supabase Client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return (
    supabaseUrl !== "https://your-project.supabase.co" &&
    supabaseAnonKey !== "your-anon-key" &&
    supabaseUrl.includes("supabase.co")
  )
}
