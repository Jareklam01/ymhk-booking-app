"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Search, Calendar, Clock, User, Users, Edit } from "lucide-react"
import { loadBookings, type Booking } from "@/lib/supabase-storage"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  isClosing: boolean
  isMobile?: boolean
  onEditBooking?: (booking: Booking) => void
}

export function SearchModal({ isOpen, onClose, isClosing, isMobile = false, onEditBooking }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Booking[]>([])
  const [allBookings, setAllBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      fetchAllBookings()
    }
  }, [isOpen])

  useEffect(() => {
    if (searchTerm.trim()) {
      performSearch(searchTerm)
      setShowDropdown(true)
    } else {
      setSearchResults([])
      setShowDropdown(false)
    }
  }, [searchTerm, allBookings])

  // 點擊外部時關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchAllBookings = async () => {
    setIsLoading(true)
    try {
      const bookings = await loadBookings()
      setAllBookings(bookings)
    } catch (error) {
      console.error("Failed to load bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const performSearch = (term: string) => {
    const lowercaseTerm = term.toLowerCase()
    const filtered = allBookings.filter(
      (booking) =>
        booking.user.toLowerCase().includes(lowercaseTerm) ||
        booking.team.toLowerCase().includes(lowercaseTerm) ||
        booking.remarks.toLowerCase().includes(lowercaseTerm) ||
        booking.date.includes(term) ||
        booking.from_time.includes(term) ||
        booking.to_time.includes(term),
    )
    setSearchResults(filtered)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5)
  }

  const handleEditClick = (booking: Booking) => {
    if (onEditBooking) {
      onEditBooking(booking)
    }
    onClose()
  }

  if (!isOpen) return null

  // 手機版搜尋欄
  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 modal-bright-glass border-b border-white/10 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <div className="p-4" ref={searchRef}>
          <div className="flex items-center gap-3 mb-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-60" />
              <Input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.trim() && setShowDropdown(true)}
                className="glass-input pl-10 pr-4 h-12 rounded-xl w-full"
                autoFocus
              />
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              size="icon"
              className="glass-button h-12 w-12 rounded-xl bg-transparent"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* 下拉結果 */}
          {showDropdown && (
            <div className="absolute left-4 right-4 top-20 modal-bright-glass rounded-xl shadow-lg max-h-[60vh] overflow-y-auto z-10">
              {isLoading ? (
                <div className="text-center py-8 opacity-60">Loading bookings...</div>
              ) : searchTerm.trim() === "" ? (
                <div className="text-center py-8 opacity-60">Enter search terms to find bookings</div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8 opacity-60">No bookings found matching your search</div>
              ) : (
                <div className="p-2">
                  {searchResults.map((booking) => (
                    <div key={booking.id} className="p-3 hover:bg-white/10 rounded-lg transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="font-semibold text-sm">{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 opacity-80">
                            <Clock className="h-3 w-3" />
                            <span className="font-mono text-xs">
                              {formatTime(booking.from_time)} - {formatTime(booking.to_time)}
                            </span>
                          </div>
                          <Button
                            onClick={() => handleEditClick(booking)}
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-md glass-button"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          <span className="font-medium text-sm">{booking.user}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          <span className="px-2 py-1 rounded-md bg-blue-500/70 text-white text-xs font-medium">
                            {booking.team}
                          </span>
                        </div>
                      </div>

                      {booking.remarks && (
                        <div className="text-xs bg-white/10 rounded-lg p-2 opacity-80">
                          <span className="font-medium">Remarks:</span> {booking.remarks}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // 桌面版彈窗
  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 z-[90]"
        onClick={onClose}
        style={{
          backdropFilter: "blur(4px)",
        }}
      />

      {/* 彈窗 */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${
          isClosing ? "animate-out fade-out-0 zoom-out-95 duration-200" : "animate-in fade-in-0 zoom-in-95 duration-200"
        }`}
      >
        <div className="modal-bright-glass w-full max-w-2xl max-h-[80vh] flex flex-col rounded-3xl">
          {/* 標題欄 */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Search className="h-6 w-6" />
              <h2 className="text-xl font-bold">Search Bookings</h2>
            </div>
            <Button onClick={onClose} variant="ghost" size="icon" className="hover:bg-white/10 rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* 搜尋輸入框 */}
          <div className="p-6 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-60" />
              <Input
                type="text"
                placeholder="Search by user, team, remarks, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input pl-10 pr-4 h-12 rounded-xl w-full"
                autoFocus
              />
            </div>
          </div>

          {/* 結果 */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="text-center py-8 opacity-60">Loading bookings...</div>
            ) : searchTerm.trim() === "" ? (
              <div className="text-center py-8 opacity-60">Enter search terms to find bookings</div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-8 opacity-60">No bookings found matching your search</div>
            ) : (
              <div className="space-y-4">
                {searchResults.map((booking) => (
                  <div key={booking.id} className="p-4 glass-card rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 text-lg font-semibold">
                        <Calendar className="h-4 w-4" />
                        {formatDate(booking.date)}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-sm font-mono opacity-80">
                          <Clock className="h-4 w-4" />
                          {formatTime(booking.from_time)} - {formatTime(booking.to_time)}
                        </div>
                        <Button
                          onClick={() => handleEditClick(booking)}
                          variant="outline"
                          size="sm"
                          className="ml-2 glass-button"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{booking.user}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="px-2 py-1 rounded-md bg-blue-500/70 text-white text-sm font-medium">
                          {booking.team}
                        </span>
                      </div>
                    </div>

                    {booking.remarks && (
                      <div className="text-xs bg-white/10 rounded-lg p-3 opacity-80">
                        <span className="font-medium">Remarks:</span> {booking.remarks}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
