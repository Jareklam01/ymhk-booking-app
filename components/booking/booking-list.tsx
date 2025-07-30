"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import type { Booking } from "@/lib/supabase-storage"

interface BookingListProps {
  currentDate: Date
  bookings: Booking[]
  highlightedBookingIds: string[]
  onBookingClick: (booking: Booking) => void
  calendarRef: React.RefObject<HTMLDivElement>
}

export function BookingList({
  currentDate,
  bookings,
  highlightedBookingIds,
  onBookingClick,
  calendarRef,
}: BookingListProps) {
  const listCardRef = useRef<HTMLDivElement>(null)
  const bookingListRef = useRef<HTMLDivElement>(null)
  const bookingRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Updated height adjustment to ensure booking list matches calendar height
  useEffect(() => {
    const adjustListHeight = () => {
      if (calendarRef.current && listCardRef.current) {
        const calendarHeight = calendarRef.current.offsetHeight
        if (window.innerWidth >= 1024) {
          listCardRef.current.style.height = `${calendarHeight}px`
          listCardRef.current.style.minHeight = `${calendarHeight}px`
          listCardRef.current.style.maxHeight = `${calendarHeight}px`
        } else {
          listCardRef.current.style.height = "auto"
          listCardRef.current.style.minHeight = "auto"
          listCardRef.current.style.maxHeight = "none"
        }
      }
    }

    let resizeObserver: ResizeObserver | null = null

    if (calendarRef.current) {
      resizeObserver = new ResizeObserver(adjustListHeight)
      resizeObserver.observe(calendarRef.current)
    }

    const timeoutId = setTimeout(adjustListHeight, 100)
    window.addEventListener("resize", adjustListHeight)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("resize", adjustListHeight)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [currentDate, bookings, calendarRef])

  return (
    <Card ref={listCardRef} className="glass-card rounded-3xl overflow-hidden booking-list-container">
      <div className="p-4 sm:p-6 text-xl sm:text-2xl font-bold text-foreground bg-transparent flex-shrink-0 text-center">
        {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })} Bookings
      </div>
      <div ref={bookingListRef} className="divide-y divide-white/10 flex-grow overflow-y-auto custom-scrollbar">
        {bookings.length === 0 ? (
          <div className="p-6 sm:p-8 text-center text-base sm:text-lg text-foreground">No bookings for this month.</div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              ref={(el) => (bookingRefs.current[booking.id] = el)}
              onClick={() => onBookingClick(booking)}
              className={`p-3 sm:p-4 cursor-pointer text-foreground hover:bg-white/10 ${
                highlightedBookingIds.includes(booking.id) ? "bg-yellow-500/30" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <div className="font-bold text-base sm:text-lg">
                  {new Date(booking.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="font-mono text-xs sm:text-sm">
                  {booking.from_time.slice(0, 5)} - {booking.to_time.slice(0, 5)}
                </div>
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-semibold">{booking.user}</span> - {booking.team}
              </div>
              {booking.remarks && (
                <div className="text-xs text-foreground mt-1 truncate">Remarks: {booking.remarks}</div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
