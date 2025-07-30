"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check for dark mode preference from localStorage or system
    const isDarkMode =
      localStorage.getItem("theme") === "dark" ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
    setDarkMode(isDarkMode)
    document.documentElement.classList.toggle("dark", isDarkMode)

    // Redirect to booking page as the main page
    router.replace("/booking")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Redirecting...</div>
    </div>
  )
}
