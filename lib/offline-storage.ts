// Define the Booking interface for type safety
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

// Key for storing bookings in localStorage
const LOCAL_STORAGE_KEY = "dct_bookings_offline"

/**
 * Loads all bookings from localStorage.
 * If no data exists or data is invalid, returns an empty array.
 */
export function loadBookings(): Booking[] {
  if (typeof window === "undefined") {
    return [] // Return empty array if not in browser environment
  }
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (data) {
      const parsedData: Booking[] = JSON.parse(data)
      // Basic validation to ensure it's an array of objects
      if (
        Array.isArray(parsedData) &&
        parsedData.every((item) => typeof item === "object" && item !== null && "id" in item)
      ) {
        return parsedData
      }
    }
  } catch (error) {
    console.error("Failed to load bookings from localStorage:", error)
  }
  return [] // Return empty array if parsing fails or no data
}

/**
 * Saves the given array of bookings to localStorage.
 */
export function saveBookings(bookings: Booking[]): void {
  if (typeof window === "undefined") {
    return
  }
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookings))
  } catch (error) {
    console.error("Failed to save bookings to localStorage:", error)
  }
}

/**
 * Adds a new booking to localStorage.
 */
export function addBooking(newBooking: Booking): void {
  const currentBookings = loadBookings()
  currentBookings.push(newBooking)
  saveBookings(currentBookings)
}

/**
 * Updates an existing booking in localStorage.
 */
export function updateBooking(updatedBooking: Booking): void {
  const currentBookings = loadBookings()
  const index = currentBookings.findIndex((b) => b.id === updatedBooking.id)
  if (index !== -1) {
    currentBookings[index] = updatedBooking
    saveBookings(currentBookings)
  }
}

/**
 * Deletes a booking from localStorage by its ID.
 */
export function deleteBooking(bookingId: string): void {
  const currentBookings = loadBookings()
  const filteredBookings = currentBookings.filter((b) => b.id !== bookingId)
  saveBookings(filteredBookings)
}
