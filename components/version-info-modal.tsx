"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Calendar, User, FileText } from "lucide-react"

interface VersionInfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VersionInfoModal({ isOpen, onClose }: VersionInfoModalProps) {
  if (!isOpen) return null

  // Get current date and time
  const now = new Date()
  const lastUpdatedTime =
    now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) +
    " at " +
    now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="glass-card rounded-3xl w-full max-w-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-foreground">Version Information</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-foreground hover:bg-white/10">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Last Updated Time */}
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-foreground/70 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Last Updated Time</h3>
              <p className="text-sm text-foreground/70">{lastUpdatedTime}</p>
            </div>
          </div>

          {/* Developed by */}
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-foreground/70 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Developed by</h3>
              <p className="text-sm text-foreground/70">Yusen Logistics Development Team</p>
            </div>
          </div>

          {/* Latest Updates */}
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-foreground/70 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Latest Updates</h3>
              <ul className="text-sm text-foreground/70 space-y-1">
                <li>• Enhanced calendar interface with improved booking indicators</li>
                <li>• Updated numeric keypad with rounded corners</li>
                <li>• Improved light mode card backgrounds for better contrast</li>
                <li>• Fixed custom background functionality for videos</li>
                <li>• Optimized mobile responsiveness</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
