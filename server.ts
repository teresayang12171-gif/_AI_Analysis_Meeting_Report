import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Get Gemini Client safely
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("找不到 GEMINI_API_KEY 環境變數，請至 Settings > Secrets 設定。");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// System Instructions
const SYSTEM_INSTRUCTIONS = `你是一位專業的會議記錄助理。請根據使用者提供的會議逐字稿，整理出結構化的會議紀錄。

請務必遵守以下輸出格式要求：

1. **會議主題與時間**：擷取會議的主題與時間。
2. **與會者**：列出參與會議的人員。
3. **會議重點總結**：用 3 到 5 個重點總結會議內容。
4. **Action Items (待辦事項)**：明確列出接下來的待辦事項與負責人。
5. **英文翻譯版**：將上述 1~4 點的內容完整翻譯成專業的英文。

請以 Markdown 格式輸出，所有繁體中文部分必須使用**繁體中文**回覆，不要包含任何額外的問候語或結語。`;

// Helper to build explicit prompt
function buildPrompt(transcript: string, settings: { outputStyle: string; targetLanguage: string; tone: string }) {
  const styleLabels: Record<string, string> = {
    detailed: "詳細會議記錄（包含：會議基本資訊、背景脈絡、詳細主題討論重點、決策彙整、完整待辦任務清單、備註項目）",
    concise: "精簡摘要（精煉於 500-800 字內，直切要點。包含：一句話會議宗旨、3 大核心決策、極簡下一步行動清單）",
    bulletPoints: "全列點重點（去除冗長的段落敘述，整篇以巢狀條列式 Bullet Points 方式清晰呈現，將背景、論點、決策、行動逐條拆解，極易掃讀）",
    actionItems: "行動方針優先（將「待辦任務與時程分配表」以 Markdown 表格形式置於最上層，隨後緊跟決策緣由與簡短進度摘要，適合專案經理與開發團隊追蹤）"
  };

  const langLabels: Record<string, string> = {
    "zh-TW": "繁體中文 (台灣 / zh-TW)",
    en: "英文 (English / en)",
    ja: "日文 (日本語 / ja)",
    ko: "韓文 (한국어 / ko)"
  };

  const toneLabels: Record<string, string> = {
    professional: "專業客觀（使用正式學術、商務用詞，口吻中立、客觀無偏差，適合向上彙報給老闆或發送給外部客戶）",
    friendly: "輕鬆友善（口吻熱情、口語化且富凝聚力，常使用‘大家’、‘夥伴們’、‘我們團隊’等詞，非常適合日常站會、Squad 內部工作交流）",
    structured: "結構嚴謹（強調邏輯關聯，時間線清晰，條分縷析，非常適合技術架構討論會、工程需求對接或專案管理會議）"
  };

  return `
以下是需要處理的原始會議逐字稿/筆記內容：
=== 原始內容開始 ===
${transcript}
=== 原始內容結束 ===

---

【處理要求設定】
1. **排版格式樣式**：\n   - 請以 **${styleLabels[settings.outputStyle] || styleLabels.detailed}** 為架構輸出。
2. **輸出目的語系**：\n   - 請將上述所有內容，深度翻譯並完整以 **${langLabels[settings.targetLanguage] || langLabels["zh-TW"]}** 輸出。
3. **語氣口吻語調**：\n   - 請完全使用 **${toneLabels[settings.tone] || toneLabels.professional}** 的語調。

請現在開始處理，產出高質感的專業會議記錄與總結網頁報告。
`;
}

// API endpoint for generating notes
app.post("/api/generate", async (req, res) => {
  try {
    const { transcript, settings } = req.body;

    if (!transcript || typeof transcript !== "string" || transcript.trim() === "") {
      res.status(400).json({ success: false, error: "未接收到任何會議逐字稿或筆記內容。" });
      return;
    }

    if (!settings) {
      res.status(400).json({ success: false, error: "缺少輸出設定參數。" });
      return;
    }

    const ai = getGeminiClient();
    const prompt = buildPrompt(transcript, settings);

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        temperature: 0.35, // Low temperature for factual consistency and structured output
      },
    });

    const generatedText = response.text || "";

    // Calculate nice stats
    const originalWords = transcript.trim().length;
    const generatedWords = generatedText.trim().length;

    res.json({
      success: true,
      text: generatedText,
      stats: {
        originalWords,
        generatedWords,
        estimatedCharacters: generatedText.length,
      },
    });
  } catch (err: any) {
    console.error("Gemini API 處理錯誤:", err);
    res.status(500).json({
      success: false,
      error: err.message || "處理會議記錄時發生未知錯誤。",
    });
  }
});

// Setup Vite or Static assets serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
