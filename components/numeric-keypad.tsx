"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Delete } from "lucide-react"

interface NumericKeypadProps {
  password: string
  onNumberClick: (number: string) => void
  onClear: () => void
  onDelete: () => void
  onDone: () => void
  isVisible: boolean
}

export function NumericKeypad({ password, onNumberClick, onClear, onDelete, onDone, isVisible }: NumericKeypadProps) {
  if (!isVisible) return null

  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="glass-card rounded-3xl p-6 w-full max-w-sm">
        {/* Password Indicators */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 transition-colors ${
                index < password.length ? "bg-white border-white" : "bg-transparent border-white/50"
              }`}
            />
          ))}
        </div>

        {/* Title */}
        <div className="text-center text-white/80 mb-6 text-sm">Enter 4-digit password</div>

        {/* Number Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {numbers.map((number) => (
            <Button
              key={number}
              onClick={() => onNumberClick(number)}
              variant="ghost"
              className="h-14 text-xl font-medium glass-button rounded-3xl bg-white/10 hover:bg-white/20 text-white border-0"
            >
              {number}
            </Button>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Button
            onClick={onClear}
            variant="ghost"
            className="h-14 text-base font-medium glass-button rounded-3xl bg-white/10 hover:bg-white/20 text-white border-0"
          >
            Clear
          </Button>
          <Button
            onClick={() => onNumberClick("0")}
            variant="ghost"
            className="h-14 text-xl font-medium glass-button rounded-3xl bg-white/10 hover:bg-white/20 text-white border-0"
          >
            0
          </Button>
          <Button
            onClick={onDelete}
            variant="ghost"
            className="h-14 glass-button rounded-3xl bg-white/10 hover:bg-white/20 text-white border-0 flex items-center justify-center"
          >
            <Delete className="h-5 w-5" />
          </Button>
        </div>

        {/* Done Button */}
        <Button
          onClick={onDone}
          className="w-full h-12 text-base font-medium rounded-3xl bg-white text-black hover:bg-white/90"
        >
          Done
        </Button>
      </Card>
    </div>
  )
}
