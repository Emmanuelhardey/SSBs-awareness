import React, { useState, useEffect } from "react";
import { LayoutDashboard, Flame, ShieldAlert, Sparkles, Accessibility, MessageSquare, Volume2 } from "lucide-react";
import { SugarLog, HealthGoals, ForumPost } from "./types";

// Import components
import DashboardPage from "./components/DashboardPage";
import SugarCheckerPage from "./components/SugarCheckerPage";
import NcdInfoPage from "./components/NcdInfoPage";
import ForumPage from "./components/ForumPage";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "sugar-checker" | "ncd-info" | "forum">("dashboard");
  const [highContrast, setHighContrast] = useState(false);
  const [textSizeLarge, setTextSizeLarge] = useState(false);

  // Personalized user profile based on email metadata "emmanuelhardey@gmail.com"
  const [currentUser, setCurrentUser] = useState({
    name: "Emmanuel Hardey",
    avatar: "🏃🏾",
    role: "Health Pioneer"
  });

  // State loaded from localStorage
  const [logs, setLogs] = useState<SugarLog[]>([]);
  const [goals, setGoals] = useState<HealthGoals>({
    dailySugarLimitGrams: 25,
    targetWeightKg: "72",
    preventativeFocus: ["Type 2 Diabetes"],
    dailyHabits: [
      { id: "habit-1", text: "Skip all sugary sodas and packaged juices", done: false },
      { id: "habit-2", text: "Drink at least 8 cups of pure water", done: false },
      { id: "habit-3", text: "Read back-labels on all food packets before eating", done: false },
      { id: "habit-4", text: "Do 20 minutes of cardio exercise to burn active sugars", done: false }
    ]
  });

  // Load from localStorage
  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem("sugar_tracker_logs");
      if (storedLogs) {
        setLogs(JSON.parse(storedLogs));
      } else {
        // Pre-seed mock log for first experience
        const seedLogs: SugarLog[] = [
          {
            id: "seed-1",
            productName: "Whole Banana",
            sugarGrams: 12,
            quantity: 1,
            timestamp: new Date().toISOString()
          }
        ];
        setLogs(seedLogs);
        localStorage.setItem("sugar_tracker_logs", JSON.stringify(seedLogs));
      }

      const storedGoals = localStorage.getItem("sugar_tracker_goals");
      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
    } catch (e) {
      console.error("Local storage reading error:", e);
    }
  }, []);

  // Save logs to localStorage on changes
  const saveLogs = (updatedLogs: SugarLog[]) => {
    setLogs(updatedLogs);
    localStorage.setItem("sugar_tracker_logs", JSON.stringify(updatedLogs));
  };

  // Save goals to localStorage on changes
  const saveGoals = (updatedGoals: HealthGoals) => {
    setGoals(updatedGoals);
    localStorage.setItem("sugar_tracker_goals", JSON.stringify(updatedGoals));
  };

  const handleAddLog = (name: string, grams: number, qty: number) => {
    const newLog: SugarLog = {
      id: String(Date.now()),
      productName: name,
      sugarGrams: grams,
      quantity: qty,
      timestamp: new Date().toISOString()
    };
    const updated = [newLog, ...logs];
    saveLogs(updated);
  };

  const handleDeleteLog = (id: string) => {
    const updated = logs.filter(log => log.id !== id);
    saveLogs(updated);
  };

  const handleUpdateGoals = (newGoals: Partial<HealthGoals>) => {
    const updated = { ...goals, ...newGoals };
    saveGoals(updated);
  };

  const handleQuickAdd = (name: string, grams: number) => {
    handleAddLog(name, grams, 1);
  };

  // Calculate daily progress percentage
  const today = new Date().toDateString();
  const todayTotal = logs
    .filter(log => new Date(log.timestamp).toDateString() === today)
    .reduce((acc, log) => acc + (log.sugarGrams * log.quantity), 0);
  
  const dailyLimit = goals.dailySugarLimitGrams;
  const isLimitExceeded = todayTotal > dailyLimit;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      highContrast ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
    } ${
      textSizeLarge ? "text-lg" : "text-sm"
    }`} id="main-container">
      
      {/* Top Universal Accessibility Header */}
      <div className="bg-slate-900 text-slate-300 py-2.5 px-4 md:px-8 border-b border-slate-800 text-xs flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <Accessibility className="w-4 h-4 text-pink-400 shrink-0" />
          <span className="font-bold">ACCESSIBILITY CONTROLS FOR ALL USERS:</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase font-bold">Speech-Enabled</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Increase Text Size */}
          <button
            onClick={() => setTextSizeLarge(!textSizeLarge)}
            className={`font-bold px-3 py-1 rounded transition-colors cursor-pointer ${
              textSizeLarge ? "bg-pink-500 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            {textSizeLarge ? "Standard Font" : "Large Font Aa 🔍"}
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`font-bold px-3 py-1 rounded transition-colors cursor-pointer ${
              highContrast ? "bg-pink-500 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            {highContrast ? "Light Theme" : "High Contrast Style 🌗"}
          </button>
        </div>
      </div>

      {/* Main Top Header Branding Navbar */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-wrap justify-between items-center gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <span className="text-4xl">🍎</span>
            <div>
              <h1 className="font-display font-extrabold text-2xl tracking-tight text-slate-900 flex items-center gap-1.5 leading-none">
                SugarSmart
                <span className="text-xs bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Defend NCDs
                </span>
              </h1>
              <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
                Visual Sugar Levels Safety & Awareness Tracker
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl font-bold transition-all text-sm cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-slate-900 text-white shadow-md scale-105"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-500" />
              <span>Intake Log Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab("sugar-checker")}
              className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl font-bold transition-all text-sm cursor-pointer ${
                activeTab === "sugar-checker"
                  ? "bg-slate-900 text-white shadow-md scale-105"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Flame className="w-4 h-4 text-rose-500" />
              <span>Colorful Sugar Meter</span>
            </button>

            <button
              onClick={() => setActiveTab("ncd-info")}
              className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl font-bold transition-all text-sm cursor-pointer ${
                activeTab === "ncd-info"
                  ? "bg-slate-900 text-white shadow-md scale-105"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-sky-500" />
              <span>NCD Info & Goals</span>
            </button>

            <button
              onClick={() => setActiveTab("forum")}
              className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl font-bold transition-all text-sm cursor-pointer ${
                activeTab === "forum"
                  ? "bg-slate-900 text-white shadow-md scale-105"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span>Community Forum</span>
            </button>
          </nav>

          {/* User Profile display */}
          <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 p-2.5 rounded-2xl">
            <span className="text-3xl">{currentUser.avatar}</span>
            <div className="hidden sm:block text-left leading-none">
              <h4 className="font-bold text-xs text-gray-800 leading-none">{currentUser.name}</h4>
              <span className="text-[9px] uppercase font-bold text-gray-400 block mt-1">{currentUser.role}</span>
            </div>
          </div>

        </div>
      </header>

      {/* Quick General Warning Indicator if limit exceeded */}
      {isLimitExceeded && activeTab !== "dashboard" && (
        <div className="bg-red-500 text-white text-center py-2 px-4 text-xs font-bold font-mono tracking-wider animate-pulse uppercase flex items-center justify-center gap-2">
          <span>⚠️ WARNING: YOUR DAILY SUGAR TARGET ({dailyLimit}G) HAS BEEN EXCEEDED!</span>
          <button 
            onClick={() => setActiveTab("dashboard")} 
            className="underline hover:text-red-100 font-bold ml-1"
          >
            View Tracker Details
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        
        {/* Render pages depending on active tab */}
        {activeTab === "dashboard" && (
          <DashboardPage
            logs={logs}
            goals={goals}
            onAddLog={handleAddLog}
            onDeleteLog={handleDeleteLog}
          />
        )}

        {activeTab === "sugar-checker" && (
          <SugarCheckerPage
            onLogSugar={handleQuickAdd}
          />
        )}

        {activeTab === "ncd-info" && (
          <NcdInfoPage
            goals={goals}
            onUpdateGoals={handleUpdateGoals}
          />
        )}

        {activeTab === "forum" && (
          <ForumPage
            currentUser={currentUser}
          />
        )}

      </main>

      {/* Clean Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4 border-t border-slate-800 mt-12 text-center text-xs space-y-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <span className="font-bold text-white text-sm">SugarSmart Nutrition Defense</span>
          </div>
          <div className="flex gap-4 flex-wrap text-slate-400">
            <span>• Prevention of Diabetes, Heart Disease & Fatty Liver</span>
            <span>• Accessible Voice Readouts</span>
            <span>• Global WHO Standards</span>
          </div>
        </div>
        <p className="opacity-60 max-w-2xl mx-auto leading-relaxed">
          The information provided by SugarSmart is powered by advanced AI and public health guidelines. It should serve as a friendly, supportive educational companion, and must not replace professional clinical diagnosis or personal medical counsel.
        </p>
      </footer>

    </div>
  );
}
