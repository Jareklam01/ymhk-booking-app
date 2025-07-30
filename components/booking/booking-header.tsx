"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Moon, Sun, Monitor, Menu, Search } from "lucide-react"
import Image from "next/image"

interface BookingHeaderProps {
  darkMode: boolean
  onToggleDarkMode: () => void
  onShowSearch: () => void
  onDisplayOpen: () => void
  onShowDesktopMiniMenu: () => void
  showDesktopMiniMenu: boolean
}

export function BookingHeader({
  darkMode,
  onToggleDarkMode,
  onShowSearch,
  onDisplayOpen,
  onShowDesktopMiniMenu,
}: BookingHeaderProps) {
  return (
    <>
      {/* Header - Desktop */}
      <Card className="glass-card rounded-3xl p-4 sm:p-6 mb-4 sm:mb-6 hidden md:block">
        <div className="flex items-center justify-between gap-4 flex-nowrap">
          {/* Logo and Title Container */}
          <div className="flex items-center flex-grow relative">
            <Image
              src={darkMode ? "/images/yusen-logo-white.png" : "/images/yusen-logo-dark.png"}
              alt="Yusen Logistics Logo"
              width={150}
              height={40}
              className="flex-shrink-0 mr-4"
            />
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold drop-shadow-lg text-center flex-grow text-foreground">
              DCT Booking System
            </h1>
          </div>
          {/* Buttons Container */}
          <div className="flex flex-shrink-0 justify-end items-center gap-3 sm:gap-4">
            <Button
              onClick={onShowSearch}
              variant="outline"
              size="icon"
              className="glass-button rounded-full p-3 bg-transparent flex-shrink-0"
            >
              <Search className="h-6 w-6" />
            </Button>
            <Button
              onClick={onDisplayOpen}
              variant="outline"
              size="icon"
              className="glass-button rounded-full p-3 bg-transparent flex-shrink-0"
            >
              <Monitor className="h-6 w-6" />
            </Button>
            <Button
              onClick={onToggleDarkMode}
              variant="outline"
              size="lg"
              className="glass-button rounded-full p-3 bg-transparent flex-shrink-0"
            >
              {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </Button>
            <Button
              onClick={onShowDesktopMiniMenu}
              variant="outline"
              size="icon"
              className="glass-button rounded-full p-3 bg-transparent flex-shrink-0"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Header - Mobile (Title Only) with extra top padding for iOS safe area */}
      <div className="mb-4 md:hidden pt-4">
        <div className="flex items-center justify-between px-4">
          <h1 className="text-2xl sm:text-3xl font-bold drop-shadow-lg text-foreground">DCT Booking System</h1>
          <Button
            onClick={onShowSearch}
            variant="outline"
            size="icon"
            className="glass-button rounded-full p-3 bg-transparent flex-shrink-0"
          >
            <Search className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </>
  )
}
