// 移除所有紫色漸變背景模式
const backgroundPatterns = [
  // 只保留您指定的純色背景
]

const animatedBackgrounds = [
  // 移除所有動畫背景
]

// 移除所有 CSS 動畫
const backgroundAnimations = ``

class BackgroundManager {
  private currentBackground = 0
  private backgrounds = [
    // 只使用您指定的背景色
    "#00B9F2", // Light mode background - 您指定的藍色
    "#06183D", // Dark mode background - 您指定的深藍色
  ]

  constructor() {
    this.applyBackground()
  }

  private applyBackground() {
    // 強制設定正確的背景色，移除任何紫色背景
    const isDark = document.documentElement.classList.contains("dark")
    const backgroundColor = isDark ? "#06183D" : "#00B9F2"

    // 確保使用純色背景，完全移除漸變
    document.documentElement.style.backgroundColor = backgroundColor
    document.body.style.backgroundColor = backgroundColor
    document.body.style.backgroundAttachment = "fixed"

    // 強制移除任何漸變背景圖片
    document.body.style.backgroundImage = "none"
    document.documentElement.style.backgroundImage = "none"

    // 移除任何可能的紫色樣式
    document.body.style.background = backgroundColor
    document.documentElement.style.background = backgroundColor
  }

  resetCustomBackground() {
    // Remove any custom video elements
    const existingVideo = document.getElementById("custom-bg-video")
    if (existingVideo) {
      existingVideo.remove()
    }
    // Clear any custom background image
    document.body.style.backgroundImage = "none"
    document.documentElement.style.backgroundImage = "none"
    // Apply current solid background
    this.applyBackground()
  }

  toggleBackground() {
    // First reset any custom backgrounds
    this.resetCustomBackground()

    // Apply the correct theme background - 只使用您指定的顏色
    this.applyBackground()
    return this.currentBackground
  }

  getCurrentBackground() {
    return this.currentBackground
  }
}

export const backgroundManager = new BackgroundManager()
