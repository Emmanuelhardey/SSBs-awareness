import React, { useState } from "react";
import { Plus, Trash2, ShieldAlert, CheckCircle2, Flame, Award, Coffee, HelpCircle, Volume2 } from "lucide-react";
import { SugarLog, HealthGoals } from "../types";

interface DashboardPageProps {
  logs: SugarLog[];
  goals: HealthGoals;
  onAddLog: (name: string, grams: number, qty: number) => void;
  onDeleteLog: (id: string) => void;
}

export default function DashboardPage({ logs, goals, onAddLog, onDeleteLog }: DashboardPageProps) {
  const [fastName, setFastName] = useState("");
  const [fastGrams, setFastGrams] = useState("");
  const [fastQty, setFastQty] = useState(1);
  const [customError, setCustomError] = useState("");

  const today = new Date().toDateString();
  const todayLogs = logs.filter(log => new Date(log.timestamp).toDateString() === today);
  
  const totalSugar = todayLogs.reduce((acc, log) => acc + (log.sugarGrams * log.quantity), 0);
  const percentOfLimit = Math.round((totalSugar / goals.dailySugarLimitGrams) * 100);
  const isExceeded = totalSugar > goals.dailySugarLimitGrams;

  // Sound effect or vocal alert for exceeding limit
  const speakWarningAlert = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const alertText = `Warning! Sugar limit exceeded. You have consumed ${totalSugar} grams of sugar today, which is ${percentOfLimit} percent of your daily recommended limit. Please switch to water or high fiber foods to protect your body against diabetes.`;
    const utterance = new SpeechSynthesisUtterance(alertText);
    window.speechSynthesis.speak(utterance);
  };

  const handleFastLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fastName.trim() || !fastGrams) {
      setCustomError("Please enter a food name and sugar amount.");
      return;
    }
    const gramsNum = Number(fastGrams);
    if (isNaN(gramsNum) || gramsNum < 0) {
      setCustomError("Please enter a valid positive number for sugar.");
      return;
    }
    onAddLog(fastName.trim(), gramsNum, Number(fastQty));
    setFastName("");
    setFastGrams("");
    setFastQty(1);
    setCustomError("");

    // If adding this log exceeds the limit, immediately alert user audibly
    const prospectiveTotal = totalSugar + (gramsNum * Number(fastQty));
    if (prospectiveTotal > goals.dailySugarLimitGrams && !isExceeded) {
      setTimeout(() => speakWarningAlert(), 500);
    }
  };

  return (
    <div className="space-y-8" id="dashboard-view">
      
      {/* Alert Warning Banner - High Visibility */}
      {isExceeded && (
        <div className="bg-red-600 border-4 border-red-800 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-4">
            <span className="text-5xl">🚨</span>
            <div>
              <h3 className="font-display font-black text-2xl tracking-tight">
                Warning: Daily Sugar Limit Exceeded!
              </h3>
              <p className="text-white/90 text-sm font-medium max-w-xl">
                You have consumed <strong>{totalSugar}g</strong> of sugar today, which is {percentOfLimit}% of your {goals.dailySugarLimitGrams}g target. Elevated sugars burden your liver and increase diabetic risks!
              </p>
            </div>
          </div>
          <button
            onClick={speakWarningAlert}
            className="bg-white text-red-700 hover:bg-gray-100 font-bold px-5 py-3 rounded-2xl flex items-center gap-2 text-sm shrink-0 cursor-pointer shadow-md"
          >
            <Volume2 className="w-5 h-5" /> Speak Warning Out Loud
          </button>
        </div>
      )}

      {/* Visual Progress Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Card: Beautiful Progress Wheel & Stats */}
        <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Sugar Safety Dial</span>
              <h2 className="font-display font-bold text-2xl text-gray-800">Today's Consumption</h2>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-full font-mono">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Central progress meter */}
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="relative w-48 h-48 flex items-center justify-center">
              
              {/* Outer circular indicator color mapped to level */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  className="stroke-gray-100"
                  strokeWidth="16"
                  fill="transparent"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  className={`transition-all duration-500 ${
                    isExceeded 
                      ? "stroke-red-500" 
                      : percentOfLimit > 70 
                        ? "stroke-amber-400" 
                        : "stroke-emerald-400"
                  }`}
                  strokeWidth="16"
                  fill="transparent"
                  strokeDasharray={502}
                  strokeDashoffset={502 - (502 * Math.min(100, percentOfLimit)) / 100}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl">
                  {isExceeded ? "⚠️" : percentOfLimit > 75 ? "🧐" : "🍏"}
                </span>
                <span className="text-4xl font-black font-display text-gray-800 leading-none">
                  {totalSugar}g
                </span>
                <span className="text-xs text-gray-400 font-mono font-semibold mt-1">
                  Limit: {goals.dailySugarLimitGrams}g
                </span>
              </div>
            </div>

            <div className="text-center space-y-1">
              <span className={`text-base font-bold uppercase tracking-wider ${
                isExceeded ? "text-red-500" : percentOfLimit > 70 ? "text-amber-500" : "text-emerald-500"
              }`}>
                {isExceeded ? "Danger Level!" : percentOfLimit > 70 ? "Approaching Limit" : "Safe Zone"}
              </span>
              <p className="text-xs text-gray-500 max-w-sm">
                {isExceeded 
                  ? "Over recommended levels. Switch to pure hydration and whole raw fibers."
                  : `You have used ${percentOfLimit}% of your daily safe threshold. Balance your next meals!`}
              </p>
            </div>
          </div>

          {/* Mini Health parameters indicators */}
          <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-6">
            <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
              <span className="text-2xl">🥄</span>
              <div>
                <span className="text-[10px] text-gray-400 font-bold block leading-none">Teaspoons today</span>
                <span className="text-lg font-black font-mono text-slate-700">
                  {Math.round(totalSugar / 4)} spoons
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <span className="text-[10px] text-gray-400 font-bold block leading-none">Streak</span>
                <span className="text-lg font-black font-mono text-slate-700">
                  3 Days ✅
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Quick Log Food Input Form */}
        <div className="md:col-span-5 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div>
            <h3 className="font-display font-bold text-xl text-gray-800">Quick Log Food</h3>
            <p className="text-xs text-gray-500">
              Directly log items here, or utilize our <strong>Colorful Sugar Meter</strong> to check unknown packages first.
            </p>
          </div>

          <form onSubmit={handleFastLog} className="space-y-4">
            
            {/* Food Name */}
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">What did you consume?</label>
              <input
                type="text"
                placeholder="E.g., Sweet Yogurt, Cookie, Honey..."
                value={fastName}
                onChange={(e) => setFastName(e.target.value)}
                required
                className="w-full p-3.5 rounded-2xl border-2 border-gray-100 focus:border-indigo-400 focus:outline-none text-sm font-semibold text-gray-700"
              />
            </div>

            {/* Sugar in Grams */}
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">Grams of Sugar (per serving)</label>
              <input
                type="number"
                placeholder="E.g., 14"
                value={fastGrams}
                onChange={(e) => setFastGrams(e.target.value)}
                required
                className="w-full p-3.5 rounded-2xl border-2 border-gray-100 focus:border-indigo-400 focus:outline-none text-sm font-semibold text-gray-700 font-mono"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">Quantity / Servings</label>
              <select
                value={fastQty}
                onChange={(e) => setFastQty(Number(e.target.value))}
                className="w-full p-3.5 rounded-2xl border-2 border-gray-100 focus:border-indigo-400 focus:outline-none text-sm font-semibold text-gray-700"
              >
                <option value={1}>1 serving</option>
                <option value={2}>2 servings</option>
                <option value={3}>3 servings</option>
                <option value={4}>4 servings</option>
              </select>
            </div>

            {customError && <p className="text-red-500 text-xs font-medium">{customError}</p>}

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer text-sm"
            >
              <Plus className="w-4 h-4" /> Save Entry
            </button>
          </form>
        </div>

      </div>

      {/* Today's History Logs */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-display font-bold text-xl text-gray-800">
          Consumption History Log
        </h3>
        
        {todayLogs.length === 0 ? (
          <div className="text-center p-12 bg-slate-50 border-4 border-dashed border-gray-100 rounded-3xl">
            <Coffee className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 font-medium">Nothing logged yet for today. Keep track of what you eat!</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {todayLogs.map((log) => {
              const portionTotal = log.sugarGrams * log.quantity;
              const isLogHigh = portionTotal > 15;
              return (
                <div 
                  key={log.id} 
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${
                    isLogHigh 
                      ? "bg-red-50 border-red-100 text-red-900" 
                      : "bg-gray-50 border-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {isLogHigh ? "🍭" : "🥦"}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm md:text-base leading-snug">{log.productName}</h4>
                      <p className="text-xs text-gray-500 font-medium">
                        {log.sugarGrams}g sugar × {log.quantity} serving{log.quantity > 1 ? "s" : ""} • logged at{" "}
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-base md:text-lg font-black font-mono block leading-none">
                        {portionTotal}g
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        Total Sugar
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteLog(log.id)}
                      className="p-2 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded-lg cursor-pointer transition-colors"
                      title="Delete log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
