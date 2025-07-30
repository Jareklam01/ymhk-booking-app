"use client"

import { Button } from "@/components/ui/button"
import { Upload, Info } from "lucide-react"

interface MiniMenuProps {
  isOpen: boolean
  onClose: () => void
  onCustomBackground?: () => void
  onShowVersionInfo: () => void
  position: "mobile" | "desktop"
}

export function MiniMenu({ isOpen, onClose, onCustomBackground, onShowVersionInfo, position }: MiniMenuProps) {
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
          {/* 桌面版專用選項 */}
          {position === "desktop" && onCustomBackground && (
            <Button
              onClick={() => {
                onCustomBackground()
                onClose()
              }}
              variant="ghost"
              className="w-full justify-start gap-3 glass-button rounded-2xl py-3"
            >
              <Upload className="h-5 w-5" />
              Custom Background
            </Button>
          )}

          {/* 版本資訊 */}
          <Button
            onClick={() => {
              onShowVersionInfo()
              onClose()
            }}
            variant="ghost"
            className="w-full justify-start gap-3 glass-button rounded-2xl py-3"
          >
            <Info className="h-5 w-5" />
            Version Info
          </Button>
        </div>
      </div>
    </>
  )
}
