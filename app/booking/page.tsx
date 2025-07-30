"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { addBooking, updateBooking, deleteBooking, type Booking } from "@/lib/supabase-storage"
import { NumericKeypad } from "@/components/numeric-keypad"
import { DisplayContent } from "@/components/display-content"
import { LoadingScreen } from "@/components/loading-screen"
import { MiniMenu } from "@/components/mini-menu"
import { VersionInfoModal } from "@/components/version-info-modal"
import { SearchModal } from "@/components/search-modal"
import { backgroundManager } from "@/lib/background-manager"

// 導入新的組件
import { BookingHeader } from "@/components/booking/booking-header"
import { BookingCalendar } from "@/components/booking/booking-calendar"
import { BookingList } from "@/components/booking/booking-list"
import { BookingModal } from "@/components/booking/booking-modal"
import { MobileNavigation } from "@/components/booking/mobile-navigation"
import { BackgroundMenu } from "@/components/background-menu"

// 導入自定義 hooks
import { useBookingState } from "@/hooks/use-booking-state"
import { useCustomBackground } from "@/hooks/use-custom-background"

export default function BookingPage() {
  const { resolvedTheme, setTheme } = useTheme()
  const darkMode = resolvedTheme === "dark"

  // 使用自定義 hooks
  const {
    currentDate,
    setCurrentDate,
    bookings,
    showModal,
    setShowModal,
    formData,
    setFormData,
    editingBooking,
    highlightedBookingIds,
    setHighlightedBookingIds,
    showKeypad,
    setShowKeypad,
    showPassword,
    setShowPassword,
    today,
    minFromTime,
    minToTime,
    fetchBookings,
    resetForm,
    handleDateDoubleClick,
    handleBookingClick,
    getBookingsForDate,
  } = useBookingState()

  const {
    hasCustomBackground,
    showBackgroundMenu,
    setShowBackgroundMenu,
    fileInputRef,
    handleCustomBackgroundClick,
    handleLoadBackground,
    handleFileChange,
    removeCustomBackground,
  } = useCustomBackground()

  // 其他狀態
  const [showDisplayModal, setShowDisplayModal] = useState(false)
  const [displayModalClosing, setDisplayModalClosing] = useState(false)
  const [showLoading, setShowLoading] = useState(true)
  const [showMiniMenu, setShowMiniMenu] = useState(false)
  const [showDesktopMiniMenu, setShowDesktopMiniMenu] = useState(false)
  const [showVersionInfo, setShowVersionInfo] = useState(false)
  const [versionInfoClosing, setVersionInfoClosing] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchModalClosing, setSearchModalClosing] = useState(false)

  const calendarRef = useRef<HTMLDivElement>(null)
  const bookingRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const bookingListRef = useRef<HTMLDivElement>(null)

  // Initialize background manager
  useEffect(() => {
    backgroundManager
  }, [])

  // 管理預設背景色
  useEffect(() => {
    if (!hasCustomBackground) {
      document.body.style.backgroundColor = darkMode ? "#06183D" : "#00B9F2"
    }
  }, [darkMode, hasCustomBackground])

  // Prevent body scroll when display modal is open
  useEffect(() => {
    if (showDisplayModal) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [showDisplayModal])

  // 控制 LoadingScreen 的顯示
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate password length
    if (formData.password.length !== 4) {
      toast({
        title: "Error ❌",
        description: "Password must be 4 digits.",
        variant: "destructive",
        className: "toast-error",
      })
      return
    }

    // More robust date validation
    const selectedDate = new Date(formData.date + "T00:00:00")
    const selectedDateTimeFrom = new Date(`${formData.date}T${formData.from_time}:00`)
    const selectedDateTimeTo = new Date(`${formData.date}T${formData.to_time}:00`)
    const now = new Date()

    // Check if date is valid
    if (isNaN(selectedDate.getTime())) {
      toast({
        title: "Error ❌",
        description: "Please select a valid date.",
        variant: "destructive",
        className: "toast-error",
      })
      return
    }

    // Check if the booking is in the past
    if (selectedDateTimeFrom < now) {
      toast({
        title: "Error ❌",
        description: "Booking cannot be set in the past.",
        variant: "destructive",
        className: "toast-error",
      })
      return
    }

    if (selectedDateTimeTo <= selectedDateTimeFrom) {
      toast({
        title: "Error ❌",
        description: "'To' time cannot be earlier than or equal to 'From' time.",
        variant: "destructive",
        className: "toast-error",
      })
      return
    }

    // Proceed with booking creation/update
    if (editingBooking) {
      const updatedBookingData: Booking = {
        ...editingBooking,
        date: formData.date,
        from_time: formData.from_time + ":00",
        to_time: formData.to_time + ":00",
        user: formData.user,
        team: formData.team,
        remarks: formData.remarks,
      }

      updateBooking(updatedBookingData).then((result) => {
        if (result) {
          toast({
            title: "Success ✅",
            description: "Booking updated successfully.",
            variant: "default",
            className: "toast-success",
          })
          setShowModal(false)
          resetForm()
          fetchBookings()
        } else {
          toast({
            title: "Error ❌",
            description: "Failed to update booking. Please try again.",
            variant: "destructive",
            className: "toast-error",
          })
        }
      })
    } else {
      const newBookingData = {
        date: formData.date,
        from_time: formData.from_time + ":00",
        to_time: formData.to_time + ":00",
        user: formData.user,
        team: formData.team,
        remarks: formData.remarks,
      }

      addBooking(newBookingData).then((result) => {
        if (result) {
          toast({
            title: "Success ✅",
            description: "Booking created successfully.",
            variant: "default",
            className: "toast-success",
          })
          setShowModal(false)
          resetForm()
          fetchBookings()
        } else {
          toast({
            title: "Error ❌",
            description: "Failed to create booking. Please try again.",
            variant: "destructive",
            className: "toast-error",
          })
        }
      })
    }
  }

  const handleDelete = () => {
    // Validate password length for deletion
    if (formData.password.length !== 4) {
      toast({
        title: "Error ❌",
        description: "Password must be 4 digits to delete.",
        variant: "destructive",
        className: "toast-error",
      })
      return
    }

    if (!editingBooking) {
      toast({
        title: "Error ❌",
        description: "No booking selected for deletion.",
        variant: "destructive",
        className: "toast-error",
      })
      return
    }

    deleteBooking(editingBooking.id)
    toast({
      title: "Success ✅",
      description: "Booking deleted successfully.",
      variant: "default",
      className: "toast-success",
    })
    setShowModal(false)
    resetForm()
    fetchBookings()
  }

  const toggleDarkMode = () => {
    setTheme(darkMode ? "light" : "dark")
  }

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  const navigateYear = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear() + direction, currentDate.getMonth(), 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const scrollToDateAndHighlight = (date: Date) => {
    const bookingsForDay = getBookingsForDate(date)

    if (bookingsForDay.length > 0) {
      const firstBookingId = bookingsForDay[0].id
      const targetElement = bookingRefs.current[firstBookingId]

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "auto", block: "start" })

        const idsToHighlight = bookingsForDay.map((b) => b.id)
        setHighlightedBookingIds(idsToHighlight)
        setTimeout(() => {
          setHighlightedBookingIds([])
        }, 1500)
      }
    } else {
      bookingListRef.current?.scrollTo({ top: 0, behavior: "auto" })
    }
  }

  const handleDisplayOpen = () => {
    setShowDisplayModal(true)
    setDisplayModalClosing(false)
  }

  const handleDisplayClose = () => {
    setDisplayModalClosing(true)
    setTimeout(() => {
      setShowDisplayModal(false)
      setDisplayModalClosing(false)
    }, 300)
  }

  const handleShowVersionInfo = () => {
    setShowVersionInfo(true)
    setVersionInfoClosing(false)
  }

  const handleCloseVersionInfo = () => {
    setVersionInfoClosing(true)
    setTimeout(() => {
      setShowVersionInfo(false)
      setVersionInfoClosing(false)
    }, 300)
  }

  const handleShowSearch = () => {
    setShowSearchModal(true)
    setSearchModalClosing(false)
  }

  const handleCloseSearch = () => {
    setSearchModalClosing(true)
    setTimeout(() => {
      setShowSearchModal(false)
      setSearchModalClosing(false)
    }, 300)
  }

  const handleEditBookingFromSearch = (booking: Booking) => {
    handleBookingClick(booking)
  }

  // Show loading screen first
  if (showLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 pb-32 md:pb-6 mobile-safe-area md:pt-8">
      {/* Hidden file input for custom background */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div className="container mx-auto">
        {/* Header */}
        <BookingHeader
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onShowSearch={handleShowSearch}
          onDisplayOpen={handleDisplayOpen}
          onShowDesktopMiniMenu={() => setShowDesktopMiniMenu(!showDesktopMiniMenu)}
          showDesktopMiniMenu={showDesktopMiniMenu}
        />

        {/* Main Content: Calendar and Booking List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
          {/* Calendar */}
          <BookingCalendar
            currentDate={currentDate}
            bookings={bookings}
            onNavigateMonth={navigateMonth}
            onNavigateYear={navigateYear}
            onGoToToday={goToToday}
            onDateDoubleClick={handleDateDoubleClick}
            onScrollToDateAndHighlight={scrollToDateAndHighlight}
            getBookingsForDate={getBookingsForDate}
          />

          {/* Monthly Booking List */}
          <BookingList
            currentDate={currentDate}
            bookings={bookings}
            highlightedBookingIds={highlightedBookingIds}
            onBookingClick={handleBookingClick}
            calendarRef={calendarRef}
          />
        </div>

        {/* Copyright Message */}
        <div className="mt-8 sm:mt-10 mb-4">
          <p className="text-xs sm:text-sm text-center text-foreground drop-shadow-sm">
            Copyright © Yusen Logistics Global Management (Hong Kong) Limited. All rights reserved.
          </p>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileNavigation
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onDisplayOpen={handleDisplayOpen}
          onShowMiniMenu={() => setShowMiniMenu(!showMiniMenu)}
          showMiniMenu={showMiniMenu}
        />

        {/* Booking Modal */}
        <BookingModal
          showModal={showModal}
          onClose={() => setShowModal(false)}
          editingBooking={editingBooking}
          formData={formData}
          onFormDataChange={setFormData}
          showPassword={showPassword}
          onShowPasswordChange={setShowPassword}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onShowKeypad={() => setShowKeypad(true)}
          today={today}
          minFromTime={minFromTime}
          minToTime={minToTime}
        />

        {/* Background Menu - Desktop */}
        <BackgroundMenu
          isOpen={showBackgroundMenu}
          onClose={() => setShowBackgroundMenu(false)}
          onLoadBackground={handleLoadBackground}
          onRemoveBackground={removeCustomBackground}
          hasCustomBackground={hasCustomBackground}
          position="desktop"
        />

        {/* Display Modal - Full Screen with Animation */}
        {showDisplayModal && (
          <div
            className="fixed inset-0 z-[100] bg-black/50"
            onTouchMove={(e) => {
              e.preventDefault()
            }}
            style={{
              touchAction: "none",
              overscrollBehavior: "none",
            }}
          >
            <div
              className={`fixed inset-0 bg-background overflow-hidden ${
                displayModalClosing ? "display-modal-exit" : "display-modal-enter"
              }`}
              onTouchMove={(e) => {
                e.stopPropagation()
              }}
              style={{
                touchAction: "pan-y",
                overscrollBehavior: "contain",
              }}
            >
              <DisplayContent onClose={handleDisplayClose} />
            </div>
          </div>
        )}

        {/* Numeric Keypad Dialog */}
        <Dialog open={showKeypad} onOpenChange={setShowKeypad}>
          <DialogContent
            className="max-w-xs mx-auto rounded-3xl p-0 keypad-background border-border"
            aria-describedby={undefined}
          >
            <DialogHeader className="sr-only">
              <DialogTitle>Enter Password</DialogTitle>
            </DialogHeader>
            <NumericKeypad
              value={formData.password}
              onChange={(val) => setFormData({ ...formData, password: val })}
              onClose={() => setShowKeypad(false)}
              maxLength={4}
            />
          </DialogContent>
        </Dialog>

        {/* Mini Menu - Mobile */}
        <MiniMenu
          isOpen={showMiniMenu}
          onClose={() => setShowMiniMenu(false)}
          onShowVersionInfo={handleShowVersionInfo}
          position="mobile"
        />

        {/* Mini Menu - Desktop */}
        <MiniMenu
          isOpen={showDesktopMiniMenu}
          onClose={() => setShowDesktopMiniMenu(false)}
          onCustomBackground={handleCustomBackgroundClick}
          onShowVersionInfo={handleShowVersionInfo}
          position="desktop"
        />

        {/* Version Info Modal */}
        <VersionInfoModal isOpen={showVersionInfo} onClose={handleCloseVersionInfo} isClosing={versionInfoClosing} />

        {/* Search Modal */}
        <SearchModal
          isOpen={showSearchModal}
          onClose={handleCloseSearch}
          isClosing={searchModalClosing}
          isMobile={window.innerWidth < 768}
          onEditBooking={handleEditBookingFromSearch}
        />
      </div>
    </div>
  )
}
