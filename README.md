# 清華大學化學館募款網站

## 專案介紹 (Project Introduction)

本專案是為清華大學化學館外牆修整與室內整治計畫設計的互動式募款平台。目標是幫助化學系籌集 NT$ 30,000,000 的renovation資金。

### 主要特點 (Key Features)

- 互動式募款介面
- 即時捐款追蹤
- 動態圖像著色進度顯示
- 團體捐款統計
- 里程碑慶祝效果

## 技術棧 (Technology Stack)

- Frontend: HTML5, CSS3, Bootstrap 5
- JavaScript: Vanilla JS
- 資料持久化: LocalStorage
- 圖表: Chart.js
- 動畫: canvas-confetti

## 安裝與運行 (Installation and Running)

### 本地開發環境

1. 克隆倉庫
```bash
git clone https://github.com/your-username/nthuchem-fundraising.git
cd nthuchem-fundraising
```

2. 直接使用Python啟動本地伺服器
```bash
python3 -m http.server 8000
```

3. 在瀏覽器中訪問 `http://localhost:8000`

## 使用說明 (Usage Guide)

### 捐款流程

1. 填寫個人資訊
   - 電子郵件
   - 姓名
   - 捐款金額
   - 選擇捐款團體

2. 點擊「捐款」按鈕

3. 觀察進度
   - 進度條實時更新
   - 建築圖像逐漸著色
   - 團體捐款統計圖表更新

## 進階資料庫整合方案 (Advanced Database Integration)

### 推薦方案：使用 Firebase Firestore

#### 優點
- 免費套件
- 即時資料同步
- 簡單的安全規則設置
- 無需自建伺服器

#### 整合步驟

1. 建立 Firebase 專案
```javascript
// 安裝 Firebase
npm install firebase

// 初始化配置
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```

2. 捐款資料結構
```javascript
const donationSchema = {
  name: String,
  email: String,
  amount: Number,
  group: String,
  timestamp: Date,
  anonymous: Boolean
};
```

3. 捐款紀錄寫入
```javascript
async function saveDonationToFirestore(donationData) {
  try {
    const docRef = await addDoc(collection(db, 'donations'), {
      ...donationData,
      timestamp: new Date()
    });
    console.log('捐款紀錄已儲存:', docRef.id);
  } catch (error) {
    console.error('儲存失敗:', error);
  }
}
```

### 替代方案：Python Flask + SQLite

1. 建立簡單的後端API
2. 使用SQLite作為本地資料庫
3. 提供RESTful接口儲存捐款資訊

## 隱私與安全 (Privacy and Security)

- 最小化個人資訊收集
- 提供匿名捐款選項
- 遵守資料保護規範

## 未來發展 (Future Roadmap)

- 社交媒體分享功能
- 捐款者榮譽牆
- 多語言支持
- 更詳細的資料分析報告

## 貢獻指南 (Contributing)

1. Fork 倉庫
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 授權 (License)

此專案採用 MIT 授權 - 詳見 [LICENSE.md](LICENSE.md) 文件

## 聯絡方式 (Contact)

- 專案維護：[您的名字/組織]
- 電子郵件：[contact@example.com]
- 專案連結：[https://github.com/your-username/nthuchem-fundraising](https://github.com/your-username/nthuchem-fundraising)

**感謝您支持清華大學化學館的renovation計畫！**
