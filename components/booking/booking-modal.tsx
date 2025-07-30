"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, User, Users, MessageSquare, Lock, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Booking } from "@/lib/supabase-storage"

interface BookingForm {
  date: string
  from_time: string
  to_time: string
  user: string
  team: string
  remarks: string
  password: string
}

interface BookingModalProps {
  showModal: boolean
  onClose: () => void
  editingBooking: Booking | null
  formData: BookingForm
  onFormDataChange: (formData: BookingForm) => void
  showPassword: boolean
  onShowPasswordChange: (show: boolean) => void
  onSubmit: (e: React.FormEvent) => void
  onDelete: () => void
  onShowKeypad: () => void
  today: string
  minFromTime: string
  minToTime: string
}

export function BookingModal({
  showModal,
  onClose,
  editingBooking,
  formData,
  onFormDataChange,
  showPassword,
  onShowPasswordChange,
  onSubmit,
  onDelete,
  onShowKeypad,
  today,
  minFromTime,
  minToTime,
}: BookingModalProps) {
  return (
    <Dialog open={showModal} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "glass-card modal-bright-glass text-foreground flex flex-col overflow-x-hidden",
          // Mobile (default) styles: full screen, no rounded corners, no animation, add top padding for safe area
          "fixed inset-0 w-full h-full max-w-full translate-x-0 translate-y-0 rounded-none p-0 mobile-safe-area pb-[env(safe-area-inset-bottom)]",
          // Desktop (md and up) styles: re-apply original positioning, max-w - REDUCED SIZE
          "md:left-[50%] md:top-[50%] md:translate-x-[-50%] md:translate-y-[-50%] md:max-w-lg md:rounded-lg md:p-6 md:pt-6 md:pb-6",
        )}
        aria-describedby={undefined}
      >
        {/* Fixed Header */}
        <DialogHeader className="flex-shrink-0 p-4 pb-2 md:pt-0">
          <DialogTitle className="text-xl font-bold text-foreground drop-shadow-lg">
            {editingBooking ? "Edit Booking" : "New Booking"}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content - Only vertical scrolling */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4">
          <form onSubmit={onSubmit} className="space-y-3 pb-4">
            {/* Date Field */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm flex items-center gap-2 text-foreground">
                <Calendar className="h-4 w-4" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => onFormDataChange({ ...formData, date: e.target.value })}
                className="glass-input rounded-xl text-base h-12 px-4 w-full"
                required
                min={today}
              />
            </div>

            {/* Time Fields */}
            <div className="space-y-2">
              <Label className="text-sm flex items-center gap-2 text-foreground">
                <Clock className="h-4 w-4" />
                Time
              </Label>
              <div className="flex gap-4 w-full">
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <Label htmlFor="from_time" className="text-xs text-foreground opacity-70">
                    From
                  </Label>
                  <Input
                    id="from_time"
                    type="time"
                    value={formData.from_time}
                    onChange={(e) => onFormDataChange({ ...formData, from_time: e.target.value })}
                    className="glass-input rounded-xl text-base h-12 px-4 w-full min-w-0"
                    required
                    step="1800"
                    min={minFromTime}
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <Label htmlFor="to_time" className="text-xs text-foreground opacity-70">
                    To
                  </Label>
                  <Input
                    id="to_time"
                    type="time"
                    value={formData.to_time}
                    onChange={(e) => onFormDataChange({ ...formData, to_time: e.target.value })}
                    className="glass-input rounded-xl text-base h-12 px-4 w-full min-w-0"
                    required
                    step="1800"
                    min={minToTime}
                  />
                </div>
              </div>
            </div>

            {/* User Field */}
            <div className="space-y-2">
              <Label htmlFor="user" className="text-sm flex items-center gap-2 text-foreground">
                <User className="h-4 w-4" />
                User
              </Label>
              <Input
                id="user"
                value={formData.user}
                onChange={(e) => onFormDataChange({ ...formData, user: e.target.value })}
                className="glass-input rounded-xl text-base h-12 px-4 w-full"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Team Field */}
            <div className="space-y-2">
              <Label htmlFor="team" className="text-sm flex items-center gap-2 text-foreground">
                <Users className="h-4 w-4" />
                Team
              </Label>
              <Input
                id="team"
                value={formData.team}
                onChange={(e) => onFormDataChange({ ...formData, team: e.target.value })}
                className="glass-input rounded-xl text-base h-12 px-4 w-full"
                placeholder="Enter team name"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm flex items-center gap-2 text-foreground">
                <Lock className="h-4 w-4" />
                Edit/Del short pass
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  inputMode="none"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={formData.password}
                  onChange={(e) => onFormDataChange({ ...formData, password: e.target.value })}
                  onFocus={onShowKeypad}
                  className="glass-input rounded-xl text-base h-12 px-4 pr-12 w-full"
                  placeholder="Enter short pass"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onMouseDown={() => onShowPasswordChange(true)}
                  onMouseUp={() => onShowPasswordChange(false)}
                  onMouseLeave={() => onShowPasswordChange(false)}
                  onTouchStart={() => onShowPasswordChange(true)}
                  onTouchEnd={() => onShowPasswordChange(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/70 hover:bg-transparent h-8 w-8"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
              <p className="text-[#FF6D10] text-xs mt-1">
                Please enter a 4-digit numeric password to prevent unauthorized modifications.
              </p>
            </div>

            {/* Remarks Field */}
            <div className="space-y-2">
              <Label htmlFor="remarks" className="text-sm flex items-center gap-2 text-foreground">
                <MessageSquare className="h-4 w-4" />
                Remarks
              </Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => onFormDataChange({ ...formData, remarks: e.target.value })}
                className="glass-input rounded-xl text-base px-4 py-3 w-full"
                placeholder="Enter remarks"
                rows={3}
              />
            </div>
          </form>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="flex-shrink-0 px-4 py-6 border-t border-white/10">
          <div className="flex gap-3">
            <Button
              type="submit"
              onClick={onSubmit}
              className="flex-1 rounded-2xl text-base py-4 bg-blue-600/70 hover:bg-blue-700/70 text-white shadow-md"
            >
              {editingBooking ? "Update" : "Create"} Booking
            </Button>
            {editingBooking && (
              <Button
                type="button"
                onClick={onDelete}
                variant="destructive"
                className="flex-1 rounded-2xl text-base py-4 bg-red-600/70 hover:bg-red-700/70 text-white shadow-md mr-3"
              >
                Delete
              </Button>
            )}
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 rounded-2xl text-base py-4 glass-button bg-transparent shadow-md"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
