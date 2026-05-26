import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Clipboard,
  CheckCircle2,
  Languages,
  FileText,
  Sliders,
  BookOpen,
  ArrowRight,
  Download,
  AlertCircle,
  TrendingDown,
  Trash2,
  Share2,
  FileSpreadsheet,
  Clock,
  Briefcase
} from "lucide-react";
import MarkdownRenderer from "./components/MarkdownRenderer";
import { GenerateSettings, GenerateResponse } from "./types";

// High-quality localized sample transcriptions for user testing
const TEMPLATES = [
  {
    id: "product-design",
    title: "📱 產品體驗升級與 AI 整合探討會",
    description: "討論關於新版 App 的導覽優化，並引入 AI 智慧助理的時程與工作分配。",
    text: `主席 (小雅)：大家都到了吧？今天我們主要討論兩個主題。第一是上個月用戶回饋「首頁導覽過於複雜」的問題，第二是我們第三季要在 App 中整合「AI 智慧推薦助理」的功能。
技術主管 (大衛)：首頁那邊我覺得是因為導覽列塞了太多東西。我建議將現有的 7 個分頁，縮減成 3 個：主頁、探索、和個人設定。其他次要功能如「優惠券「點數中心」全部移入個人設定的次級選單中。
設計師 (艾蜜莉)：我贊成大衛的看法。我也已經畫好了一版精簡版 Wireframe。我預計這週五 (5/29) 前可以把完整的 UI 設計稿交付給工程團隊。
主席 (小雅)：很好，那工程端這邊大衛估計需要多久開發？
技術主管 (大衛)：如果艾蜜莉週五給設計稿，我們預計需要 2 週的開發時間，加 1 週的 QA 測試。大約 6/19 號可以進行灰度發佈。
主席 (小雅)：好。那第二個主題「AI 智慧助理」呢？我們預算是否允許使用最新的 Gemini 3.5 模型？
技術主管 (大衛)：我們評估過 token 消耗與 API 費用。如果只是做基礎文字問答，gemini-3.5-flash 的速度最快，而且成本非常低，完全在預算內。我這週會先寫出一個測試版 API。
主席 (小雅)：那太棒了。大衛
大衛：對，我會在 6/5 前完成 AI 首期 API 測試接口建置。
行銷專員 (凱文)：那行銷宣傳這邊，我們需要等 gray release 之後，預計 6/22 號正式發佈新聞稿。我會在 6/12 前準備好所有的文案。
主席 (小雅)：沒問題！那我們會議記錄先這樣。艾蜜莉這週五給設計稿，大衛下週五（6/5）給 AI 測試 API 介面，並在 6/19 前上線新版首頁。凱文則於 6/12 前寫完文案。謝謝大家！`,
  },
  {
    id: "engineering-sprint",
    title: "💻 開發團隊雙週衝刺與架構規劃",
    description: "敏捷團隊進行 Sprint 任務盤點，討論資料庫遷移延遲與灰度部署方案。",
    text: `Scrum Master (Jerry): Hello teams, today is Sprint 14 Planning.
Frontend Developer (Helen): On the UI side, the main block is the real-time drawing dashboard. I'm currently using Canvas, but we need to optimize it. I plan to use ResizeObserver to fix canvas dimensions dynamically. This will be finished by Thursday.
Jerry: Okay, Helen's canvas resize optimization by Thursday.
Backend Lead (Bruce): For the database, we found high latency in production. We need to perform index optimization on orders. We will schedule a 2-hour server offline maintenance window at midnight this Friday, May 29, from 2 AM to 4 AM.
System Admin (Mark): I've already prepared the backup plan. Friday 2:00 AM we will execute DB maintenance. I will also deploy the monitoring alerts for port 3000.
Bruce: Awesome. And Jerry, please inform Customer Service so they can post an announcement on the homepage tomorrow.
Jerry: Got it. I will contact the CS supervisor Alice tomorrow morning to publish the system maintenance banner. Let's make sure it's up before 12:00 PM.
Helen: Note that we also have TypeScript type stripping issues. We should update the production bundling process to use esbuild cleanly. I can help with this.
Jerry: Thanks Helen. Let's start the Sprint!`,
  },
  {
    id: "marketing-strategy",
    title: "🎯 品牌年中慶行銷策略與KOL宣傳",
    description: "探討年度大促活動宣傳時限、部落客合作預算分配及視覺設計時程。",
    text: `會議主席 (Alice)：大家早，今天我們要趕快敲定下個月「六月中慶」的行銷宣傳時程。
行銷副理 (Leo)：目前的網紅 KOL 名單我已經鎖定 5 位美妝與 3 位 3C 部落客。總預算不超過 20 萬台幣。我這週會完成初步的開案報價發信。
公關企劃 (Ruby)：Leo，發信開案最好在 5/28 前做完。因為這批部落客合作的截止發文稿時間，必須壓在 6/10 會比較保險。
行銷副理 (Leo)：好，那我 5/28 下班前寄發出所有合作邀約信。
視覺設計 (Mina)：這次主視覺需要很有活力、偏夏天的亮橘色系。主視覺的 Key Visual 我預計 6/2 前可以出圖。
會議主席 (Alice)：6/2 KV 出圖可以。那我們的 Banner 需要做 5 個尺寸，用在 FB、IG 和 App Landing Page。
視覺設計 (Mina)： banner 的細部拆尺寸我需要額外 2 天時間。也就是 6/4 (四) 提供。
會議主席 (Alice)：好。另外請 Ruby 幫忙：KOL 產品寄送的物流安排，務必在 5/29 以前寄出樣品。
Ruby：沒問題，我已經聯繫好倉庫了，這週五 (5/29) 中午會全部安排常溫快遞寄出。
會議主席 (Alice)：感謝！那這次會議結論如下：Leo 於 5/28 前邀約 KOL，Ruby 於 5/29 前寄出產品樣品。Mina 於 6/2 給出主視覺 KV，6/4 完成全部 Banner 切圖。Leo 持續確認 6/10 前拿到 KOL 審稿稿件。下週同一時間追蹤進度，散會！`,
  }
];

export default function App() {
  const [transcript, setTranscript] = useState("");
  const [settings, setSettings] = useState<GenerateSettings>({
    outputStyle: "detailed",
    targetLanguage: "zh-TW",
    tone: "professional",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<GenerateResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cycling fun loading messages during generation
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    "🚀 正在精確解析會議逐字稿內容...",
    "🔍 正在過濾會議中的口角與冗言贅字...",
    "💡 提取關鍵決策、重要事項與重點大綱...",
    "✍️ 正在整理待辦任務與對應負責指派人...",
    "🌐 正在將內容深度翻譯並結構化為 Markdown...",
    "✨ 成果即將完美呈現，請稍候..."
  ];

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 3000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = async () => {
    if (!transcript.trim()) {
      setErrorMsg("請先輸入或貼上一些會議逐字稿或重點筆記！");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setResponse(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript,
          settings,
        }),
      });

      const data: GenerateResponse = await res.json();
      if (data.success) {
        setResponse(data);
      } else {
        setErrorMsg(data.error || "生成失敗，請稍後再試。");
      }
    } catch (err: any) {
      setErrorMsg("系統發生錯誤，無法連線至後端伺服器。");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAll = () => {
    if (response?.text) {
      navigator.clipboard.writeText(response.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadFile = () => {
    if (!response?.text) return;
    const blob = new Blob([response.text], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const styleLabel = {
      detailed: "詳細會議記錄",
      concise: "精簡摘要",
      bulletPoints: "全列點重點",
      actionItems: "行動優先方針"
    }[settings.outputStyle];
    
    link.href = url;
    link.setAttribute("download", `會議記錄_${styleLabel}_${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSavings = () => {
    if (!response?.stats) return 0;
    const { originalWords, generatedWords } = response.stats;
    if (originalWords === 0) return 0;
    const pct = ((originalWords - generatedWords) / originalWords) * 100;
    return pct > 0 ? Math.round(pct) : 0;
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-slate-900 flex flex-col font-sans overflow-hidden">
      {/* Premium minimal header - Geometric Balance */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-600/15">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 id="app-title" className="text-lg font-bold tracking-tight text-slate-800">
                AI 會議助手 <span className="text-indigo-600 font-semibold">| 智能總結與翻譯</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              系統狀態：正常
            </span>
          </div>
        </div>
      </header>

      {/* Main body split layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start overflow-hidden">
        
        {/* Workspace panel (Left cols) */}
        <section className="lg:col-span-6 space-y-6">
          
          {/* Quick template triggers card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5">
            <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-slate-100">
              <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
              <h2 className="text-sm font-semibold text-slate-700">範例逐字稿範本（快速測試）</h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">點選下方精選開發、營運或行銷劇本，即可自動填入編輯區進行智慧提煉：</p>
            <div className="grid grid-cols-1 gap-3">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    setTranscript(tmpl.text);
                    setErrorMsg(null);
                  }}
                  className={`text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all duration-200 shadow-xs group cursor-pointer ${
                    transcript === tmpl.text
                      ? "bg-indigo-50 border-indigo-200 text-slate-950"
                      : "bg-slate-50/60 border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`font-bold text-[13px] ${transcript === tmpl.text ? "text-indigo-600" : "text-slate-900"}`}>
                      {tmpl.title}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1 ${
                      transcript === tmpl.text ? "text-indigo-600" : "text-slate-400"
                    }`} />
                  </div>
                  <p className={`${transcript === tmpl.text ? "text-slate-600" : "text-slate-400"}`}>
                    {tmpl.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Main Input Textarea card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                <label htmlFor="transcript" className="font-semibold text-slate-700 text-sm">
                  會議逐字稿輸入
                </label>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-mono">CHARS: {transcript.length.toLocaleString()}</span>
                {transcript.trim() && (
                  <button
                    onClick={() => setTranscript("")}
                    className="text-slate-400 hover:text-rose-500 rounded transition-all flex items-center gap-1 text-xs cursor-pointer"
                    title="清空輸入框"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>清除</span>
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 bg-white">
              <textarea
                id="transcript"
                rows={13}
                value={transcript}
                onChange={(e) => {
                  setTranscript(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="請在此貼上會議的原始逐字稿內容，例如：&#10;王小明：今天我們討論關於 Q3 的產品藍圖...&#10;李美美：我認為我們應該優先處理移動端的效能優化..."
                className="w-full rounded-xl border-none bg-white py-1.5 px-2 text-[14.5px] leading-relaxed text-slate-600 focus:outline-none focus:ring-0 placeholder-slate-300 resize-none min-h-[310px]"
              />
            </div>

            {/* Custom Settings Config Container */}
            <div className="border-t border-slate-100 p-6 bg-slate-50/50 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Sliders className="w-4 h-4 text-slate-600" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">智慧分析與翻譯設定</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Output Style */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">1. 記錄樣式</span>
                  <div className="relative">
                    <select
                      value={settings.outputStyle}
                      onChange={(e) => setSettings({ ...settings, outputStyle: e.target.value as any })}
                      className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2.5 text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer shadow-xs"
                    >
                      <option value="detailed">📊 詳細會議記錄</option>
                      <option value="concise">⚡ 精簡高效摘要</option>
                      <option value="bulletPoints">📝 全條列重點彙整</option>
                      <option value="actionItems font-semibold">🚩 待辦行動方針優先</option>
                    </select>
                  </div>
                </div>

                {/* 2. Target Translation Language */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">2. 目標翻譯語言</span>
                  <div className="relative">
                    <select
                      value={settings.targetLanguage}
                      onChange={(e) => setSettings({ ...settings, targetLanguage: e.target.value as any })}
                      className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2.5 text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer shadow-xs"
                    >
                      <option value="zh-TW">🇹🇼 繁體中文 (Taiwan)</option>
                      <option value="en">🇺🇸 英文 (English)</option>
                      <option value="ja">🇯🇵 日文 (日本語)</option>
                      <option value="ko">🇰🇷 韓文 (한국어)</option>
                    </select>
                  </div>
                </div>

                {/* 3. Speaking Tone */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">3. 專業語調氛圍</span>
                  <div className="relative">
                    <select
                      value={settings.tone}
                      onChange={(e) => setSettings({ ...settings, tone: e.target.value as any })}
                      className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2.5 text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer shadow-xs"
                    >
                      <option value="professional">💼 專業公務客觀</option>
                      <option value="friendly">🤝 輕鬆敏捷交流</option>
                      <option value="structured">⚙️ 技術開發嚴謹</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {/* Error Message rendering */}
            {errorMsg && (
              <div className="p-4 mx-6 mb-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-start gap-2.5 text-xs font-medium leading-relaxed">
                <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Huge dynamic submit button */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>正在生成分析中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>立即生成總結與翻譯</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </section>

        {/* Output Panel (Right cols) */}
        <section className="lg:col-span-6">
          <AnimatePresence mode="wait">
            
            {/* Loading View State */}
            {isLoading ? (
              <motion.div
                key="loading-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white border border-slate-200 rounded-2xl p-8 min-h-[580px] shadow-sm flex flex-col items-center justify-center text-center gap-6"
              >
                <div className="relative">
                  {/* Premium spinning circles */}
                  <div className="w-16 h-16 rounded-full border-4 border-slate-50 border-t-indigo-600 animate-spin" />
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-slate-100 border-b-indigo-400 rotate-45 animate-spin duration-1000" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2 max-w-sm">
                  <p className="font-bold text-slate-800 text-base tracking-tight">AI 智能分析中</p>
                  
                  {/* Multi-step loading messages with animation */}
                  <div className="h-6 overflow-hidden">
                    <motion.p
                      key={loadingStep}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="text-xs text-indigo-600 font-semibold leading-relaxed tracking-wide"
                    >
                      {loadingMessages[loadingStep]}
                    </motion.p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                  我們採用最先進的 AI 處理模型，確保保留完整的決策細節，大約需要 10 餘秒，請稍坐片刻。
                </p>
              </motion.div>
            ) : response ? (
              
              /* Populated Output View State */
              <motion.div
                key="output-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col min-h-[580px] overflow-hidden"
              >
                
                {/* Panel Action Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                    <span className="text-sm font-semibold text-slate-700">AI 生成結果</span>
                  </div>
                  <div className="flex items-center gap-2">
                    
                    {/* Copy to clipboard */}
                    <button
                      onClick={handleCopyAll}
                      className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1 bg-white rounded-full border border-indigo-100 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500">已複製</span>
                        </>
                      ) : (
                        <>
                          <Clipboard className="w-3.5 h-3.5" />
                          <span>一鍵複製</span>
                        </>
                      )}
                    </button>

                    {/* Download file */}
                    <button
                      onClick={handleDownloadFile}
                      className="text-xs font-bold text-slate-600 hover:bg-slate-50 px-3 py-1 bg-white rounded-full border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-600" />
                      <span>匯出 .md 檔</span>
                    </button>
                    
                  </div>
                </div>

                {/* Subtitle / Efficiency Stats card */}
                {response.stats && (
                  <div className="px-6 py-3.5 bg-slate-50/25 border-b border-slate-100 grid grid-cols-3 gap-2.5 text-center text-xs">
                    
                    <div className="p-2.5 bg-white border border-slate-100 rounded-xl flex items-center justify-center gap-2 shadow-xs">
                      <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <div className="text-left leading-none">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">原始稿長</span>
                        <span className="font-mono font-bold text-slate-700 text-[12px]">{response.stats.originalWords} 字</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-100 rounded-xl flex items-center justify-center gap-2 shadow-xs">
                      <FileSpreadsheet className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <div className="text-left leading-none">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">總結字數</span>
                        <span className="font-mono font-bold text-slate-700 text-[12px]">{response.stats.generatedWords} 字</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-indigo-50/50 border border-indigo-100/50 rounded-xl flex items-center justify-center gap-2 shadow-xs">
                      <TrendingDown className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <div className="text-left leading-none">
                        <span className="block text-[9px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">資訊縮載</span>
                        <span className="font-mono font-bold text-indigo-600 text-[12px]">-{getSavings()}%</span>
                      </div>
                    </div>

                  </div>
                )}

                {/* Markdown rendering content block */}
                <div id="output-rendered-card" className="p-6 md:p-8 flex-1 overflow-y-auto max-h-[650px] bg-slate-50/10 select-text">
                  <MarkdownRenderer content={response.text || ""} />
                </div>
                
              </motion.div>
            ) : (
              
              /* Empty Standby View State */
              <div className="bg-white border border-slate-200 rounded-2xl p-8 min-h-[580px] shadow-sm flex flex-col items-center justify-center text-center gap-6">
                
                <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100/80 flex items-center justify-center text-indigo-500 shadow-inner">
                  <Sparkles className="w-7 h-7 text-indigo-500 animate-pulse" />
                </div>

                <div className="space-y-1.5 max-w-xs">
                  <h3 className="font-bold text-slate-800 text-sm tracking-tight">等待您輸入逐字稿</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    請選取左方「範例範本」或是直接在文字框中填寫會議對話，系統將為您自動生成結構化記錄。
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-w-sm pt-4 border-t border-slate-100 w-full text-left text-xs text-slate-500 leading-relaxed font-semibold">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <span>自動產生 Markdown 大綱與核取方塊待辦任務。</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Languages className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <span>支持跨語言會議翻譯及四國語系本地輸出。</span>
                  </div>
                </div>

              </div>
            )}
          </AnimatePresence>
        </section>

      </main>

      {/* Footer credits bar - Geometric Balance Layout */}
      <footer className="h-10 bg-slate-800 text-slate-400 text-[10px] flex items-center justify-between px-8 uppercase tracking-widest shrink-0 mt-8">
        <div>© 2026 INTELLIMEET TECHNOLOGY</div>
        <div className="flex gap-6 select-none">
          <span>API 狀態：運作正常</span>
          <span>延遲：240ms</span>
          <span>Version 3.5.0-Release</span>
        </div>
      </footer>
    </div>
  );
}
