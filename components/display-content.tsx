"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Moon, Sun, Monitor, ChevronLeft, ChevronRight, ArrowLeft, Upload } from "lucide-react"
import Image from "next/image"
import { loadBookings, type Booking } from "@/lib/supabase-storage"
import { toast } from "@/hooks/use-toast"
import { BackgroundMenu } from "@/components/background-menu"

interface DisplayContentProps {
  onClose: () => void
}

export function DisplayContent({ onClose }: DisplayContentProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const darkMode = resolvedTheme === "dark"
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [displayBackground, setDisplayBackground] = useState<string | null>(null)
  const [hasCustomBackground, setHasCustomBackground] = useState(false)
  const [showBackgroundMenu, setShowBackgroundMenu] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 載入已儲存的顯示背景
  useEffect(() => {
    const savedBackground = localStorage.getItem("dct-display-background")
    const savedBackgroundType = localStorage.getItem("dct-display-background-type")

    if (savedBackground && savedBackgroundType) {
      setDisplayBackground(savedBackground)
      setHasCustomBackground(true)
      applyDisplayBackground(savedBackground, savedBackgroundType)
    } else {
      setHasCustomBackground(false)
      // 確保預設背景色正確顯示
      updateDefaultBackground()
    }
  }, [])

  // 監聽主題變化，更新預設背景色
  useEffect(() => {
    if (!hasCustomBackground) {
      updateDefaultBackground()
    }
  }, [darkMode, hasCustomBackground])

  // 更新預設背景色
  const updateDefaultBackground = () => {
    const displayContainer = document.querySelector(".display-modal-container") as HTMLElement
    if (displayContainer && !hasCustomBackground) {
      displayContainer.style.backgroundColor = darkMode ? "#06183D" : "#00B9F2"
    }
  }

  const fetchBookings = async () => {
    const allBookings = (await loadBookings()) ?? []
    const now = new Date()
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    const filteredBookings = allBookings
      .filter((booking) => {
        const bookingDateTime = new Date(`${booking.date}T${booking.from_time}`)
        return bookingDateTime >= startOfMonth && bookingDateTime <= endOfMonth && bookingDateTime >= now
      })
      .sort((a, b) => {
        const dateA = new Date(a.date + "T" + a.from_time)
        const dateB = new Date(b.date + "T" + b.from_time)
        return dateA.getTime() - dateB.getTime()
      })

    setBookings(filteredBookings)
  }

  useEffect(() => {
    fetchBookings()
    const intervalId = setInterval(fetchBookings, 5000)
    return () => clearInterval(intervalId)
  }, [currentMonth])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    return {
      fullDate: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
      dayOfWeek: `(${days[date.getDay()]})`,
    }
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5)
  }

  const navigateMonth = (direction: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1))
  }

  const navigateYear = (direction: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear() + direction, currentMonth.getMonth(), 1))
  }

  const scrollToTop = () => {
    const container = document.querySelector(".display-content-container")
    if (container) {
      container.scrollTo({ top: 0, behavior: "auto" })
    }
  }

  const applyDisplayBackground = (url: string, type: string) => {
    const displayContainer = document.querySelector(".display-modal-container") as HTMLElement
    if (!displayContainer) return

    if (type === "video") {
      // 移除現有影片
      const existingVideo = displayContainer.querySelector("#display-bg-video") as HTMLVideoElement
      if (existingVideo) {
        existingVideo.remove()
      }

      // 為顯示背景建立影片元素
      const video = document.createElement("video")
      video.id = "display-bg-video"
      video.src = url
      video.autoplay = true
      video.loop = true
      video.muted = true
      video.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        object-fit: cover;
        z-index: -1;
        pointer-events: none;
      `

      // 測試影片是否能載入
      video.onerror = () => {
        console.log("Video failed to load, removing custom background")
        removeDisplayBackground()
        video.remove()
      }

      displayContainer.appendChild(video)
      displayContainer.style.backgroundImage = ""
    } else {
      // 移除任何現有影片
      const existingVideo = displayContainer.querySelector("#display-bg-video")
      if (existingVideo) {
        existingVideo.remove()
      }

      // 測試圖片是否能載入
      const testImg = new Image()
      testImg.onload = () => {
        displayContainer.style.backgroundImage = `url(${url})`
        displayContainer.style.backgroundSize = "cover"
        displayContainer.style.backgroundPosition = "center"
        displayContainer.style.backgroundRepeat = "no-repeat"
        displayContainer.style.backgroundAttachment = "fixed"
      }
      testImg.onerror = () => {
        console.log("Image failed to load, removing custom background")
        removeDisplayBackground()
        displayContainer.style.backgroundImage = ""
      }
      testImg.src = url
    }
  }

  const handleCustomBackgroundClick = () => {
    setShowBackgroundMenu(true)
  }

  const handleLoadBackground = () => {
    fileInputRef.current?.click()
  }

  const removeDisplayBackground = () => {
    localStorage.removeItem("dct-display-background")
    localStorage.removeItem("dct-display-background-type")
    setDisplayBackground(null)
    setHasCustomBackground(false)

    const displayContainer = document.querySelector(".display-modal-container") as HTMLElement
    if (displayContainer) {
      // 移除自訂背景
      displayContainer.style.backgroundImage = ""
      const existingVideo = displayContainer.querySelector("#display-bg-video")
      if (existingVideo) {
        existingVideo.remove()
      }
      // 恢復預設背景色
      displayContainer.style.backgroundColor = darkMode ? "#06183D" : "#00B9F2"
    }

    toast({
      title: "Background Removed ✅",
      description: "Custom background has been removed successfully!",
      variant: "default",
      className: "toast-success",
    })
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileType = file.type
      if (fileType.startsWith("image/") || fileType.startsWith("video/")) {
        const url = URL.createObjectURL(file)
        const type = fileType.startsWith("video/") ? "video" : "image"

        setDisplayBackground(url)
        setHasCustomBackground(true)

        // 儲存到 localStorage
        localStorage.setItem("dct-display-background", url)
        localStorage.setItem("dct-display-background-type", type)

        // 套用背景到顯示彈窗
        applyDisplayBackground(url, type)

        toast({
          title: "Display Background Set ✅",
          description: `${type === "video" ? "Video" : "Image"} background has been applied to DCT Usage Schedule!`,
          variant: "default",
          className: "toast-success",
        })
      } else {
        toast({
          title: "Invalid File Type ❌",
          description: "Please select an image or video file.",
          variant: "destructive",
          className: "toast-error",
        })
      }
    }
  }

  const toggleDarkMode = () => {
    setTheme(darkMode ? "light" : "dark")
  }

  return (
    <div
      className="display-modal-container fixed inset-0 z-50"
      style={{
        backgroundAttachment: "fixed",
        backgroundColor: hasCustomBackground ? "transparent" : darkMode ? "#06183D" : "#00B9F2",
      }}
    >
      {/* Hidden file input for custom background */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div
        className="display-content-container h-full overflow-y-auto overflow-x-hidden p-4 sm:p-6 pb-16 md:pb-8 pt-[calc(env(safe-area-inset-top)+1rem)] md:pt-8 relative z-10"
        onTouchMove={(e) => {
          // 防止觸摸事件冒泡到背景
          e.stopPropagation()
        }}
        style={{
          // 確保滑動只在這個容器內
          touchAction: "pan-y",
          overscrollBehavior: "contain",
        }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* 標題欄 - 桌面版 */}
          <Card className="glass-card rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 hidden md:block relative">
            <div className="flex items-center justify-between gap-4 flex-nowrap">
              {/* Logo 和標題容器 */}
              <div className="flex items-center flex-grow relative">
                <Image
                  src={darkMode ? "/images/yusen-logo-white.png" : "/images/yusen-logo-dark.png"}
                  alt="Yusen Logistics Logo"
                  width={150}
                  height={40}
                  className="flex-shrink-0 mr-4"
                />
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold drop-shadow-lg text-center flex-grow">
                  DCT USAGE SCHEDULE
                </h1>
              </div>

              {/* 按鈕容器 */}
              <div className="flex flex-shrink-0 justify-end items-center gap-3 sm:gap-4">
                <Button
                  onClick={handleCustomBackgroundClick}
                  variant="outline"
                  size="icon"
                  className="glass-button rounded-full p-3 flex-shrink-0 bg-transparent"
                  title="Set Custom Background for DCT Usage Schedule"
                >
                  <Upload className="h-6 w-6" />
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="icon"
                  className="glass-button rounded-full p-3 flex-shrink-0 bg-transparent"
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
                <Button
                  onClick={toggleDarkMode}
                  variant="outline"
                  size="lg"
                  className="glass-button rounded-full p-3 flex-shrink-0 bg-transparent"
                >
                  {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </Card>

          {/* 標題欄 - 手機版（僅標題，無 logo，無按鈕） */}
          <Card className="glass-card rounded-3xl p-4 mb-4 md:hidden mt-4">
            <h1 className="text-2xl sm:text-3xl font-bold drop-shadow-lg text-center whitespace-nowrap overflow-hidden text-ellipsis pt-2">
              DCT USAGE SCHEDULE
            </h1>
          </Card>

          {/* 主要內容容器 - 固定高度與滾動 */}
          <div className="hidden md:block h-[calc(100vh-280px)]">
            <Card className="glass-card rounded-3xl overflow-hidden h-full flex flex-col">
              {/* 月份/年份顯示 */}
              <div className="flex justify-center items-center gap-2 p-4 bg-transparent flex-shrink-0">
                <Button
                  onClick={() => navigateYear(-1)}
                  variant="outline"
                  size="lg"
                  className="glass-button rounded-full text-lg px-4 py-3"
                >
                  {"<<"}
                </Button>
                <Button
                  onClick={() => navigateMonth(-1)}
                  variant="outline"
                  size="lg"
                  className="glass-button rounded-full text-lg px-4 py-3"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="glass-button rounded-full text-lg px-6 py-3 font-bold">
                  {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </div>
                <Button
                  onClick={() => navigateMonth(1)}
                  variant="outline"
                  size="lg"
                  className="glass-button rounded-full text-lg px-4 py-3"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Button
                  onClick={() => navigateYear(1)}
                  variant="outline"
                  size="lg"
                  className="glass-button rounded-full text-lg px-4 py-3"
                >
                  {">>"}
                </Button>
              </div>

              {/* 表格標題 - 更新網格佈局 */}
              <div className="grid grid-cols-[1fr_0.6fr_0.6fr_0.8fr_1fr_2.5fr] gap-4 px-6 py-3 text-lg font-semibold bg-transparent border-b border-white/10 flex-shrink-0">
                <div className="text-center">Date</div>
                <div className="text-center">From</div>
                <div className="text-center">To</div>
                <div className="text-center">User</div>
                <div className="text-center">Team</div>
                <div className="text-center">Remarks</div>
              </div>

              {/* 表格內容 - 可滾動 */}
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                {bookings.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-xl">No upcoming bookings for this month.</div>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10 flex-1">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="grid grid-cols-[1fr_0.6fr_0.6fr_0.8fr_1fr_2.5fr] gap-4 px-6 py-4 text-base hover:bg-white/10"
                      >
                        <div className="font-medium text-center">{formatDate(booking.date).fullDate}</div>
                        <div className="font-mono text-center">{formatTime(booking.from_time)}</div>
                        <div className="font-mono text-center">{formatTime(booking.to_time)}</div>
                        <div className="font-medium text-center">{booking.user}</div>
                        <div className="text-center">
                          <span
                            className="px-3 py-1 rounded-xl font-medium bg-blue-500/50 text-white inline-block max-w-full"
                            style={{
                              fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            title={booking.team}
                          >
                            {booking.team}
                          </span>
                        </div>
                        <div className="text-center truncate">{booking.remarks}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 資料刷新指示器在可滾動容器內 */}
                <div className="flex-shrink-0 p-4 text-center border-t border-white/10">
                  <div className="text-base drop-shadow-sm">
                    <Monitor className="inline-block mr-2 h-5 w-5" />
                    Data is automatically refreshed.
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 小螢幕列表（手機/平板） */}
          <div className="md:hidden">
            {bookings.length === 0 ? (
              <Card className="glass-card rounded-3xl p-8 text-center text-lg">
                No upcoming bookings for this month.
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const { fullDate, dayOfWeek } = formatDate(booking.date)
                  return (
                    <Card key={booking.id} className="glass-card rounded-3xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-bold text-base whitespace-nowrap overflow-hidden text-ellipsis">
                          {fullDate} {dayOfWeek}
                        </div>
                        <div className="font-mono text-base">
                          {formatTime(booking.from_time)} - {formatTime(booking.to_time)}
                        </div>
                      </div>
                      <div className="text-base mb-1">
                        <span className="font-semibold">{booking.user}</span> -{" "}
                        <span className="px-2 py-1 rounded-md bg-blue-500/50 text-white text-sm">{booking.team}</span>
                      </div>
                      {booking.remarks && (
                        <div className="text-sm">
                          <span className="font-semibold">Remarks:</span> {booking.remarks}
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {/* 版權 - 在容器外 */}
          <div className="hidden md:block mt-4 text-center">
            <p className="text-sm drop-shadow-sm">
              Copyright © Yusen Logistics Global Management (Hong Kong) Limited. All rights reserved.
            </p>
          </div>

          {/* 手機底部導航 - 僅顯示關閉按鈕，無 logo 或深色模式切換 */}
          <div className="fixed bottom-8 left-0 right-0 md:hidden z-50">
            <div className="flex justify-center px-6">
              <Button
                onClick={onClose}
                variant="outline"
                size="lg"
                className="glass-card rounded-full px-12 py-6 bg-background/60 backdrop-blur-md hover:bg-background/90 shadow-lg"
              >
                <ArrowLeft className="h-10 w-10 mr-2" />
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Background Menu */}
      <BackgroundMenu
        isOpen={showBackgroundMenu}
        onClose={() => setShowBackgroundMenu(false)}
        onLoadBackground={handleLoadBackground}
        onRemoveBackground={removeDisplayBackground}
        hasCustomBackground={hasCustomBackground}
        position="desktop"
      />
    </div>
  )
}
