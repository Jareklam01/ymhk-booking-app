import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://rycpixkwbuzkofvdwulg.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5Y3BpeGt3YnV6a29mdmR3dWxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MjQ3ODAsImV4cCI6MjA2ODQwMDc4MH0.REwRAl2FRusZbsb-FJ2MTVUYnTZp_SZIazZBsbQ__wM"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log("Testing Supabase connection...")

    // Test basic connection
    const { data, error } = await supabase.from("bookings").select("count", { count: "exact", head: true })

    if (error) {
      console.error("Connection error:", error)
      return
    }

    console.log("✅ Connection successful!")
    console.log("Total bookings:", data)

    // Test fetching actual data
    const { data: bookings, error: fetchError } = await supabase.from("bookings").select("*").limit(5)

    if (fetchError) {
      console.error("Fetch error:", fetchError)
      return
    }

    console.log("✅ Data fetch successful!")
    console.log("Sample bookings:", bookings)
  } catch (err) {
    console.error("Unexpected error:", err)
  }
}

testConnection()
