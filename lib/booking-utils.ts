// Helper function to format a Date object to YYYY-MM-DD string in local time
export const formatLocalDateToYYYYMMDD = (date: Date) => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  return `${year}-${month}-${day}`
}

// Helper function to round current time up to the nearest half-hour
export const getRoundedCurrentTime = (): string => {
  const now = new Date()
  let hours = now.getHours()
  let minutes = now.getMinutes()

  if (minutes > 30) {
    hours = (hours + 1) % 24
    minutes = 0
  } else if (minutes > 0 && minutes <= 30) {
    minutes = 30
  } else {
    minutes = 0
  }

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
}

// 將文件轉換為base64的輔助函數
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
