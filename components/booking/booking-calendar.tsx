"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { formatLocalDateToYYYYMMDD } from "@/lib/booking-utils"
import type { Booking } from "@/lib/supabase-storage"

interface BookingCalendarProps {
  currentDate: Date
  bookings: Booking[]
  onNavigateMonth: (direction: number) => void
  onNavigateYear: (direction: number) => void
  onGoToToday: () => void
  onDateDoubleClick: (date: Date) => void
  onScrollToDateAndHighlight: (date: Date) => void
  getBookingsForDate: (date: Date) => Booking[]
}

export function BookingCalendar({
  currentDate,
  bookings,
  onNavigateMonth,
  onNavigateYear,
  onGoToToday,
  onDateDoubleClick,
  onScrollToDateAndHighlight,
  getBookingsForDate,
}: BookingCalendarProps) {
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  return (
    <Card className="glass-card rounded-3xl overflow-hidden">
      {/* Calendar Navigation */}
      <div className="flex justify-center items-center gap-2 p-2 sm:p-4 bg-transparent pt-4">
        <Button
          onClick={() => onNavigateYear(-1)}
          variant="outline"
          size="lg"
          className="glass-button rounded-full text-sm px-3 py-2 sm:text-lg sm:px-4 sm:py-3 bg-transparent"
        >
          {"<<"}
        </Button>
        <Button
          onClick={() => onNavigateMonth(-1)}
          variant="outline"
          size="lg"
          className="glass-button rounded-full text-sm px-3 py-2 sm:text-lg sm:px-4 sm:py-3 bg-transparent"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          onClick={onGoToToday}
          variant="outline"
          size="lg"
          className="glass-button rounded-full text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3 bg-transparent font-bold"
        >
          {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </Button>
        <Button
          onClick={() => onNavigateMonth(1)}
          variant="outline"
          size="lg"
          className="glass-button rounded-full text-sm px-3 py-2 sm:text-lg sm:px-4 sm:py-3 bg-transparent"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
        <Button
          onClick={() => onNavigateYear(1)}
          variant="outline"
          size="lg"
          className="glass-button rounded-full text-sm px-3 py-2 sm:text-lg sm:px-4 sm:py-3 bg-transparent"
        >
          {">>"}
        </Button>
      </div>

      {/* Calendar Header */}
      <div className="grid grid-cols-7 gap-0 p-2 sm:p-4 text-sm sm:text-lg font-semibold text-foreground bg-transparent">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Body */}
      <div className="grid grid-cols-7 gap-0">
        {getDaysInMonth().map((date, index) => {
          const bookingsForDate = date ? getBookingsForDate(date) : []
          const bookingCount = bookingsForDate.length
          const isToday = date && formatLocalDateToYYYYMMDD(date) === formatLocalDateToYYYYMMDD(new Date())

          return (
            <div
              key={index}
              className={`min-h-[100px] sm:min-h-[120px] p-2 border-b border-white/10 flex flex-col justify-between items-center ${
                date ? "cursor-pointer hover:bg-white/10" : ""
              } ${isToday ? "bg-blue-500/30" : ""}`}
              onClick={() => {
                if (date) {
                  const bookingsForDate = getBookingsForDate(date)
                  if (bookingsForDate.length === 0) {
                    onDateDoubleClick(date)
                  } else {
                    onScrollToDateAndHighlight(date)
                  }
                }
              }}
              onDoubleClick={() => date && onDateDoubleClick(date)}
            >
              {date && (
                <>
                  <div
                    className={`text-base sm:text-lg font-medium mb-1 sm:mb-2 text-foreground ${isToday ? "font-bold" : ""}`}
                  >
                    {date.getDate()}
                  </div>
                  {bookingCount > 0 && (
                    <div className="w-6 h-6 flex items-center justify-center rounded-full text-white text-xs font-bold bg-[#FF6D10]">
                      {bookingCount}
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
