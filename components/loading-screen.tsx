"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

// 移除 LoadingScreenProps 介面，因為不再需要任何 props
// interface LoadingScreenProps {
//   onComplete: () => void
// }

// 移除 onComplete 參數
export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer)
          // 這裡不再呼叫 onComplete，因為它不再是 prop
          return 100
        }
        const diff = Math.random() * 10
        return Math.min(oldProgress + diff, 100)
      })
    }, 200)

    return () => {
      clearInterval(timer)
    }
  }, []) // 依賴陣列為空，確保只在客戶端掛載時運行一次

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 transition-colors duration-300"
      style={{
        backgroundColor: isDark ? "#06183D" : "#00B9F2",
      }}
    >
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        {/* Logo - Increased size */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/yusen-logo-white.png"
            alt="Yusen Logistics Logo"
            width={400}
            height={120}
            className=""
            priority
          />
        </div>

        {/* Title - Made smaller */}
        <div className="space-y-4">
          <h1 className="text-lg md:text-xl font-bold text-white">DCT Booking System</h1>

          {/* Simplified subtitle */}
          <p className="text-base text-white/80">Initializing...</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-xs mx-auto">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-white/70 mt-2">{Math.round(progress)}%</p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    </div>
  )
}
