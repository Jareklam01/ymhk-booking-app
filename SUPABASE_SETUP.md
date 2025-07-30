# Supabase 設置指南

本指南將引導你完成 Supabase 的設置，以便你的 DCT Booking System 專案能夠正確連接並使用資料庫。

## 步驟 1: 創建 Supabase 專案

1.  前往 [Supabase 網站](https://supabase.com/) 並登入你的帳戶。
2.  點擊 "New project" (新專案) 或選擇一個現有的專案。
3.  為你的專案命名，並選擇一個資料庫密碼和區域。
4.  點擊 "Create new project" (創建新專案)。

## 步驟 2: 獲取 Supabase 憑證

專案創建完成後，你需要獲取 API 憑證：

1.  在你的 Supabase 專案儀表板中，導航到左側菜單的 **"Project Settings" (專案設置)**。
2.  點擊 **"API"** 選項。
3.  你會看到 "Project URL" (專案 URL) 和 "Project API keys" (專案 API 密鑰)。
4.  複製以下兩個值：
    *   **`URL`** (例如: `https://your-project-id.supabase.co`)
    *   **`anon public`** (例如: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 步驟 3: 配置環境變數

在你的專案根目錄下創建一個名為 `.env.local` 的文件（如果它還不存在），並將你剛才複製的 Supabase 憑證貼入其中：

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=你的_Supabase_專案_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_Supabase_匿名_密鑰
\`\`\`

**重要提示：**
*   請將 `你的_Supabase_專案_URL` 和 `你的_Supabase_匿名_密鑰` 替換為你在步驟 2 中獲取到的實際值。
*   `NEXT_PUBLIC_` 前綴是必要的，因為這些變數需要在客戶端代碼中訪問。
*   `.env.local` 文件不應該被提交到版本控制（例如 Git），因為它包含敏感信息。

## 步驟 4: 運行 SQL 腳本設置資料庫

你的專案包含了一些 SQL 腳本，用於設置資料庫模式和填充範例數據。

1.  在 Supabase 儀表板中，導航到左側菜單的 **"SQL Editor" (SQL 編輯器)**。
2.  點擊 **"New query" (新查詢)**。

### 4.1 創建 `bookings` 表

複製 `scripts/create-database.sql` 文件中的所有內容，貼到 Supabase SQL 編輯器中，然後點擊 "Run" (運行) 按鈕。

這將創建 `bookings` 表並設置初始的 Row Level Security (RLS) 策略。

### 4.2 更新 RLS 策略 (允許匿名訪問)

複製 `scripts/update-rls-policies.sql` 文件中的所有內容，貼到 Supabase SQL 編輯器中，然後點擊 "Run" (運行) 按鈕。

這個腳本會更新 RLS 策略，允許匿名用戶讀取、插入、更新和刪除預訂。這對於測試和演示非常有用。

### 4.3 填充範例數據 (可選)

複製 `scripts/seed-data.sql` 文件中的所有內容，貼到 Supabase SQL 編輯器中，然後點擊 "Run" (運行) 按鈕。

這將向 `bookings` 表中插入一些範例預訂數據，方便你測試應用程式。

## 步驟 5: 測試 Supabase 連接

你的專案中包含一個 `scripts/test-connection.js` 文件，可以用來驗證你的 Supabase 連接是否成功。

1.  在你的本地開發環境中，打開終端機。
2.  確保你已經安裝了 Node.js。
3.  運行以下命令來執行測試腳本：

    \`\`\`bash
    node scripts/test-connection.js
    \`\`\`

    如果一切設置正確，你應該會看到類似以下的輸出：

    \`\`\`
    Testing Supabase connection...
    ✅ Connection successful!
    Total bookings: 6
    ✅ Data fetch successful!
    Sample bookings: [...]
    \`\`\`

    如果出現錯誤，請檢查你的 `.env.local` 文件中的憑證是否正確，以及 SQL 腳本是否已成功運行。

完成以上步驟後，你的 DCT Booking System 專案應該就能夠成功連接到 Supabase 資料庫並正常運行了！
