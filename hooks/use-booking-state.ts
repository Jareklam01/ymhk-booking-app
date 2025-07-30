"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "@/hooks/use-toast"
import { loadBookings, saveBookings, addBooking, updateBooking, deleteBooking } from "@/lib/offline-storage"
import { supabaseStorage, isSupabaseConfigured } from "@/lib/supabase-storage"
import type { Booking } from "@/lib/supabase-storage"

export type { Booking }

export function useBookingState() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(true)

  // 檢查網絡狀態
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // 載入 bookings
  const loadAllBookings = useCallback(async () => {
    setIsLoading(true)
    try {
      console.log("Loading bookings...", { isOnline, isSupabaseConfigured: isSupabaseConfigured() })

      if (isOnline && isSupabaseConfigured()) {
        // 嘗試從 Supabase 載入
        try {
          const supabaseBookings = await supabaseStorage.getBookings()
          console.log("Loaded from Supabase:", supabaseBookings.length)
          setBookings(supabaseBookings)

          // 同步到 localStorage 作為備份
          saveBookings(supabaseBookings)
        } catch (error) {
          console.error("Failed to load from Supabase, falling back to localStorage:", error)
          // 如果 Supabase 失敗，用 localStorage
          const localBookings = loadBookings()
          console.log("Loaded from localStorage (fallback):", localBookings.length)
          setBookings(localBookings)
        }
      } else {
        // 離線或 Supabase 未配置，用 localStorage
        const localBookings = loadBookings()
        console.log("Loaded from localStorage (offline/not configured):", localBookings.length)
        setBookings(localBookings)
      }
    } catch (error) {
      console.error("Error loading bookings:", error)
      toast({
        title: "載入失敗 ❌",
        description: "無法載入預約資料，請重新整理頁面",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [isOnline])

  // 初始載入
  useEffect(() => {
    loadAllBookings()
  }, [loadAllBookings])

  // 新增 booking
  const createBooking = useCallback(
    async (newBooking: Omit<Booking, "id" | "created_at">) => {
      try {
        const bookingWithId: Booking = {
          ...newBooking,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
        }

        console.log("Creating booking:", bookingWithId)

        if (isOnline && isSupabaseConfigured()) {
          try {
            // 嘗試儲存到 Supabase
            await supabaseStorage.createBooking(bookingWithId)
            console.log("Saved to Supabase successfully")
          } catch (error) {
            console.error("Failed to save to Supabase:", error)
            toast({
              title: "同步警告 ⚠️",
              description: "預約已儲存到本地，但無法同步到雲端",
              variant: "default",
            })
          }
        }

        // 儲存到 localStorage
        addBooking(bookingWithId)
        setBookings((prev) => [...prev, bookingWithId])

        toast({
          title: "預約成功 ✅",
          description: "新預約已成功建立",
          variant: "default",
        })

        return bookingWithId
      } catch (error) {
        console.error("Error creating booking:", error)
        toast({
          title: "建立失敗 ❌",
          description: "無法建立預約，請重試",
          variant: "destructive",
        })
        throw error
      }
    },
    [isOnline],
  )

  // 更新 booking
  const editBooking = useCallback(
    async (updatedBooking: Booking) => {
      try {
        console.log("Updating booking:", updatedBooking)

        if (isOnline && isSupabaseConfigured()) {
          try {
            await supabaseStorage.updateBooking(updatedBooking)
            console.log("Updated in Supabase successfully")
          } catch (error) {
            console.error("Failed to update in Supabase:", error)
            toast({
              title: "同步警告 ⚠️",
              description: "預約已更新到本地，但無法同步到雲端",
              variant: "default",
            })
          }
        }

        // 更新 localStorage
        updateBooking(updatedBooking)
        setBookings((prev) => prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)))

        toast({
          title: "更新成功 ✅",
          description: "預約已成功更新",
          variant: "default",
        })
      } catch (error) {
        console.error("Error updating booking:", error)
        toast({
          title: "更新失敗 ❌",
          description: "無法更新預約，請重試",
          variant: "destructive",
        })
        throw error
      }
    },
    [isOnline],
  )

  // 刪除 booking
  const removeBooking = useCallback(
    async (bookingId: string) => {
      try {
        console.log("Deleting booking:", bookingId)

        if (isOnline && isSupabaseConfigured()) {
          try {
            await supabaseStorage.deleteBooking(bookingId)
            console.log("Deleted from Supabase successfully")
          } catch (error) {
            console.error("Failed to delete from Supabase:", error)
            toast({
              title: "同步警告 ⚠️",
              description: "預約已從本地刪除，但無法從雲端刪除",
              variant: "default",
            })
          }
        }

        // 從 localStorage 刪除
        deleteBooking(bookingId)
        setBookings((prev) => prev.filter((b) => b.id !== bookingId))

        toast({
          title: "刪除成功 ✅",
          description: "預約已成功刪除",
          variant: "default",
        })
      } catch (error) {
        console.error("Error deleting booking:", error)
        toast({
          title: "刪除失敗 ❌",
          description: "無法刪除預約，請重試",
          variant: "destructive",
        })
        throw error
      }
    },
    [isOnline],
  )

  // 重新載入
  const refreshBookings = useCallback(() => {
    loadAllBookings()
  }, [loadAllBookings])

  return {
    bookings,
    isLoading,
    isOnline,
    createBooking,
    editBooking,
    removeBooking,
    refreshBookings,
  }
}
