import { supabase, isSupabaseConfigured } from "./supabase"

export interface Booking {
  id: string
  date: string
  from_time: string
  to_time: string
  user: string
  team: string
  remarks: string
  created_at: string
}

class SupabaseStorage {
  private tableName = "bookings"

  async getBookings(): Promise<Booking[]> {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase not configured")
    }

    console.log("Fetching bookings from Supabase...")
    const { data, error } = await supabase.from(this.tableName).select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase getBookings error:", error)
      throw error
    }

    console.log("Supabase bookings fetched:", data?.length || 0)
    return data || []
  }

  async createBooking(booking: Booking): Promise<Booking> {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase not configured")
    }

    console.log("Creating booking in Supabase:", booking)
    const { data, error } = await supabase.from(this.tableName).insert([booking]).select().single()

    if (error) {
      console.error("Supabase createBooking error:", error)
      throw error
    }

    console.log("Supabase booking created:", data)
    return data
  }

  async updateBooking(booking: Booking): Promise<Booking> {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase not configured")
    }

    console.log("Updating booking in Supabase:", booking)
    const { data, error } = await supabase.from(this.tableName).update(booking).eq("id", booking.id).select().single()

    if (error) {
      console.error("Supabase updateBooking error:", error)
      throw error
    }

    console.log("Supabase booking updated:", data)
    return data
  }

  async deleteBooking(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase not configured")
    }

    console.log("Deleting booking from Supabase:", id)
    const { error } = await supabase.from(this.tableName).delete().eq("id", id)

    if (error) {
      console.error("Supabase deleteBooking error:", error)
      throw error
    }

    console.log("Supabase booking deleted:", id)
  }
}

export const supabaseStorage = new SupabaseStorage()
export { isSupabaseConfigured }
