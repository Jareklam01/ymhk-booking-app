"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun, Monitor } from "lucide-react"
import Image from "next/image"

interface MobileNavigationProps {
  darkMode: boolean
  onToggleDarkMode: () => void
  onDisplayOpen: () => void
  onShowMiniMenu: () => void
  showMiniMenu: boolean
}

export function MobileNavigation({ darkMode, onToggleDarkMode, onDisplayOpen, onShowMiniMenu }: MobileNavigationProps) {
  return (
    <div className="fixed bottom-8 left-0 right-0 md:hidden z-50">
      <div className="relative flex justify-center px-6">
        <div className="relative">
          {/* Background pill shape */}
          <div className="glass-card rounded-full px-8 py-4 flex items-center justify-between w-80 h-16 bg-background/60 backdrop-blur-md">
            {/* Left Button - Dark/Light Mode */}
            <Button
              onClick={onToggleDarkMode}
              variant="ghost"
              size="lg"
              className="rounded-2xl px-6 py-3 bg-transparent text-foreground hover:bg-white/10"
            >
              {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </Button>
            {/* Spacer for center button */}
            <div className="w-20"></div>
            {/* Right Button - Display */}
            <Button
              onClick={onDisplayOpen}
              variant="ghost"
              size="lg"
              className="rounded-2xl px-6 py-3 bg-transparent text-foreground hover:bg-white/10"
            >
              <Monitor className="h-6 w-6" />
            </Button>
          </div>

          {/* Center protruding circular button - Changed to mini menu */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-4">
            <Button
              onClick={onShowMiniMenu}
              variant="outline"
              size="lg"
              className="w-20 h-20 rounded-full glass-card border-4 border-white/20 bg-background/80 backdrop-blur-md text-foreground hover:bg-background/90 shadow-lg p-0 overflow-hidden"
            >
              <Image
                src={darkMode ? "/images/yusen-logo-white.png" : "/images/yusen-logo-dark.png"}
                alt="Yusen Logo"
                width={70}
                height={35}
                className="object-contain w-full h-full max-w-[70px] max-h-[35px]"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
