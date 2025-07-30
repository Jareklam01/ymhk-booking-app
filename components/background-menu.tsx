"use client"

import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

interface BackgroundMenuProps {
  isOpen: boolean
  onClose: () => void
  onLoadBackground: () => void
  onRemoveBackground: () => void
  hasCustomBackground: boolean
  position: "mobile" | "desktop"
}

export function BackgroundMenu({
  isOpen,
  onClose,
  onLoadBackground,
  onRemoveBackground,
  hasCustomBackground,
  position,
}: BackgroundMenuProps) {
  if (!isOpen) return null

  return (
    <>
      {/* 背景遮罩 */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* 選單 */}
      <div
        className={`fixed z-50 glass-card rounded-3xl p-4 ${
          position === "mobile" ? "bottom-32 left-1/2 transform -translate-x-1/2 w-80" : "top-20 right-6 w-64"
        }`}
      >
        <div className="space-y-3">
          {/* 載入背景 */}
          <Button
            onClick={() => {
              onLoadBackground()
              onClose()
            }}
            variant="ghost"
            className="w-full justify-start gap-3 glass-button rounded-2xl py-3"
          >
            <Upload className="h-5 w-5" />
            Load Background
          </Button>

          {/* 移除自訂背景 - 只有在有自訂背景時才顯示 */}
          {hasCustomBackground && (
            <Button
              onClick={() => {
                onRemoveBackground()
                onClose()
              }}
              variant="ghost"
              className="w-full justify-start gap-3 glass-button rounded-2xl py-3 text-red-400 hover:text-red-300"
            >
              <X className="h-5 w-5" />
              Remove Background
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
