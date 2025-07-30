"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { toast } from "@/hooks/use-toast"
import { fileToBase64 } from "@/lib/booking-utils"

export const useCustomBackground = () => {
  const [hasCustomBackground, setHasCustomBackground] = useState(false)
  const [showBackgroundMenu, setShowBackgroundMenu] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 清除自訂背景函數
  const clearCustomBackground = () => {
    // 移除影片元素
    const existingVideo = document.getElementById("booking-custom-bg-video")
    if (existingVideo) {
      existingVideo.remove()
    }

    // 清除背景圖片，但保留預設的 light/dark mode 背景
    document.body.style.backgroundImage = ""
    document.body.style.backgroundSize = ""
    document.body.style.backgroundPosition = ""
    document.body.style.backgroundRepeat = ""
    document.body.style.backgroundAttachment = ""

    // 不要清除 backgroundColor，讓 light/dark mode 背景色正常顯示
  }

  // 處理背景錯誤
  const handleBackgroundError = () => {
    console.log("Handling background error - clearing custom background")
    localStorage.removeItem("dct-booking-background")
    localStorage.removeItem("dct-booking-background-type")
    setHasCustomBackground(false)
    clearCustomBackground()
  }

  // 移除自訂背景
  const removeCustomBackground = () => {
    localStorage.removeItem("dct-booking-background")
    localStorage.removeItem("dct-booking-background-type")
    setHasCustomBackground(false)
    clearCustomBackground()

    toast({
      title: "Background Removed ✅",
      description: "Custom background has been removed successfully!",
      variant: "default",
      className: "toast-success",
    })
  }

  // 套用自訂背景函數
  const applyCustomBackground = async (dataUrl: string, type: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      console.log("Applying custom background:", { type, dataUrlLength: dataUrl.length })

      // 清除現有自訂背景，但保留預設背景色
      clearCustomBackground()

      try {
        if (type === "video") {
          const video = document.createElement("video")
          video.id = "booking-custom-bg-video"
          video.src = dataUrl
          video.autoplay = true
          video.loop = true
          video.muted = true
          video.playsInline = true
          video.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            object-fit: cover !important;
            z-index: -10 !important;
            pointer-events: none !important;
          `

          video.onloadeddata = () => {
            console.log("Custom video background loaded successfully")
            setHasCustomBackground(true)
            resolve()
          }

          video.onerror = (error) => {
            console.error("Failed to load custom video background:", error)
            handleBackgroundError()
            reject(error)
          }

          document.body.appendChild(video)
        } else {
          // 圖片背景
          const img = new Image()
          img.onload = () => {
            console.log("Custom image background loaded successfully")
            document.body.style.backgroundImage = `url(${dataUrl})`
            document.body.style.backgroundSize = "cover"
            document.body.style.backgroundPosition = "center"
            document.body.style.backgroundRepeat = "no-repeat"
            document.body.style.backgroundAttachment = "fixed"
            setHasCustomBackground(true)
            resolve()
          }

          img.onerror = (error) => {
            console.error("Failed to load custom image background:", error)
            handleBackgroundError()
            reject(error)
          }

          img.src = dataUrl
        }
      } catch (error) {
        console.error("Error applying custom background:", error)
        handleBackgroundError()
        reject(error)
      }
    })
  }

  // 初始化自訂背景
  useEffect(() => {
    const initializeCustomBackground = async () => {
      try {
        const savedBackground = localStorage.getItem("dct-booking-background")
        const savedBackgroundType = localStorage.getItem("dct-booking-background-type")

        console.log("Initializing custom background:", {
          hasBackground: !!savedBackground,
          type: savedBackgroundType,
          backgroundLength: savedBackground?.length,
        })

        if (savedBackground && savedBackgroundType) {
          // 檢查是否為有效的base64 data URL
          if (savedBackground.startsWith("data:")) {
            setHasCustomBackground(true)
            await applyCustomBackground(savedBackground, savedBackgroundType)
          } else {
            // 清除無效的背景數據
            console.log("Invalid background data found, clearing...")
            handleBackgroundError()
          }
        } else {
          setHasCustomBackground(false)
          clearCustomBackground()
        }
      } catch (error) {
        console.error("Error initializing custom background:", error)
        handleBackgroundError()
      }
    }

    // 延遲初始化確保DOM已載入
    const timer = setTimeout(initializeCustomBackground, 100)
    return () => clearTimeout(timer)
  }, [])

  // 處理自訂背景按鈕點擊
  const handleCustomBackgroundClick = () => {
    setShowBackgroundMenu(true)
  }

  // 處理載入背景
  const handleLoadBackground = () => {
    fileInputRef.current?.click()
  }

  // 處理文件變更（移除文件大小限制）
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const fileType = file.type
    console.log("File selected:", { name: file.name, type: fileType, size: file.size })

    if (fileType.startsWith("image/") || fileType.startsWith("video/")) {
      try {
        // 顯示載入提示
        toast({
          title: "Processing Background...",
          description: "Please wait while we process your background.",
          variant: "default",
        })

        // 轉換為base64
        const base64Data = await fileToBase64(file)
        const type = fileType.startsWith("video/") ? "video" : "image"

        console.log("File converted to base64:", {
          type,
          base64Length: base64Data.length,
          originalSize: file.size,
        })

        // 儲存到localStorage
        localStorage.setItem("dct-booking-background", base64Data)
        localStorage.setItem("dct-booking-background-type", type)

        // 套用背景
        await applyCustomBackground(base64Data, type)

        toast({
          title: "Custom Background Set ✅",
          description: `${type === "video" ? "Video" : "Image"} background has been applied successfully!`,
          variant: "default",
          className: "toast-success",
        })
      } catch (error) {
        console.error("Error handling file:", error)
        toast({
          title: "Error ❌",
          description: "Failed to set custom background. Please try again.",
          variant: "destructive",
          className: "toast-error",
        })
      }
    } else {
      toast({
        title: "Invalid File Type ❌",
        description: "Please select an image or video file.",
        variant: "destructive",
        className: "toast-error",
      })
    }

    // 清除input值以允許重新選擇同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return {
    hasCustomBackground,
    showBackgroundMenu,
    setShowBackgroundMenu,
    fileInputRef,
    handleCustomBackgroundClick,
    handleLoadBackground,
    handleFileChange,
    removeCustomBackground,
  }
}
