import React, { useState } from "react";
import { Shield, Heart, Activity, Settings, HelpCircle, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { HealthGoals } from "../types";

interface NcdInfoPageProps {
  goals: HealthGoals;
  onUpdateGoals: (newGoals: Partial<HealthGoals>) => void;
}

export default function NcdInfoPage({ goals, onUpdateGoals }: NcdInfoPageProps) {
  const [activeTab, setActiveTab] = useState<"ncd-list" | "settings">("ncd-list");
  const [limitInput, setLimitInput] = useState(goals.dailySugarLimitGrams);
  const [weightInput, setWeightInput] = useState(goals.targetWeightKg);
  const [savedMessage, setSavedMessage] = useState(false);

  const toggleFocus = (disease: string) => {
    let updatedFocus = [...goals.preventativeFocus];
    if (updatedFocus.includes(disease)) {
      updatedFocus = updatedFocus.filter((f) => f !== disease);
    } else {
      updatedFocus.push(disease);
    }
    onUpdateGoals({ preventativeFocus: updatedFocus });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGoals({
      dailySugarLimitGrams: Number(limitInput),
      targetWeightKg: weightInput,
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const toggleHabit = (habitId: string) => {
    const updatedHabits = goals.dailyHabits.map((h) => 
      h.id === habitId ? { ...h, done: !h.done } : h
    );
    onUpdateGoals({ dailyHabits: updatedHabits });
  };

  const ncdData = [
    {
      id: "diabetes",
      title: "Type 2 Diabetes",
      subtitle: "The Body's Sugar Exhaustion",
      icon: "🩸",
      color: "from-red-50 to-rose-100 text-red-700 border-red-200",
      accent: "bg-red-500",
      description: "When we consume massive amounts of sugar, the pancreas is forced to release heavy amounts of Insulin to clear it. Over time, your body cells build 'Insulin Resistance', causing sugar to remain in the bloodstream, leading to chronic Diabetes.",
      prevention: [
        "Avoid liquid sugars (soda, sweetened coffee, packed juice)",
        "Choose foods high in soluble fiber (beans, whole oats, brown rice)",
        "Exercise daily to help your muscles naturally absorb glucose without extra insulin"
      ]
    },
    {
      id: "heart",
      title: "Cardiovascular Diseases",
      subtitle: "Artery Damage & Inflammation",
      icon: "❤️",
      color: "from-pink-50 to-rose-100 text-rose-700 border-rose-200",
      accent: "bg-rose-500",
      description: "Excess sugar is transformed by your liver into fats called Triglycerides. High levels of these fats block blood flow in arteries and increase systemic inflammation, greatly accelerating heart attacks and stroke risks.",
      prevention: [
        "Swap high-fructose corn syrups for raw vegetables and healthy nuts",
        "Keep daily added sugar intake strictly under 25-30g",
        "Monitor blood pressure and engage in energetic aerobic routines"
      ]
    },
    {
      id: "obesity",
      title: "Chronic Obesity",
      subtitle: "Silent Metabolic Fat Storage",
      icon: "⚖️",
      color: "from-amber-50 to-orange-100 text-amber-700 border-amber-200",
      accent: "bg-amber-500",
      description: "High sugar consumption triggers the hunger hormone Ghrelin while blocking Leptin (the fullness hormone). This leads to chronic overeating, and all excess sugar is securely locked away in the body as visceral fat deposits.",
      prevention: [
        "Snack on organic whole berries instead of highly processed biscuits",
        "Read all packaged labels to identify hidden syrup names",
        "Drink plenty of water (at least 2.5 liters) to regulate satiety signals"
      ]
    },
    {
      id: "liver",
      title: "Fatty Liver Disease",
      subtitle: "Fructose Poisoning",
      icon: "🧬",
      color: "from-purple-50 to-indigo-100 text-purple-700 border-purple-200",
      accent: "bg-purple-500",
      description: "Unlike glucose which is used by all cells, Fructose (the sugar in corn syrup and soda) can ONLY be processed by the liver. When flooded, the liver has no choice but to convert it immediately to fatty liver deposits.",
      prevention: [
        "Drastically limit sweets, candies, and sweetened morning cereals",
        "Include liver-friendly foods like broccoli, spinach, and avocados",
        "Minimize alcohol intake alongside sugar, as both double-strain liver processing"
      ]
    }
  ];

  return (
    <div className="space-y-8" id="ncd-prevention-view">
      {/* Page Title Header */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 p-8 rounded-3xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-2">
            🛡️ Health Defense & Prevention
          </h1>
          <p className="text-white/90 max-w-xl text-sm md:text-base">
            Understand how excessive sugar fuels chronic non-communicable diseases (NCDs), and customize your personal target parameters.
          </p>
        </div>
        
        {/* View Switch Buttons */}
        <div className="flex bg-white/10 p-1.5 rounded-2xl border border-white/10 self-start md:self-auto shrink-0">
          <button
            onClick={() => setActiveTab("ncd-list")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === "ncd-list" ? "bg-white text-slate-900 shadow" : "text-white hover:bg-white/5"
            }`}
          >
            📊 Disease Analysis
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === "settings" ? "bg-white text-slate-900 shadow" : "text-white hover:bg-white/5"
            }`}
          >
            ⚙️ Personal Goals
          </button>
        </div>
      </div>

      {activeTab === "ncd-list" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Disease detailed guide cards */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-display font-bold text-2xl text-gray-800">
              Sugar-Driven Chronic Diseases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ncdData.map((ncd) => (
                <div 
                  key={ncd.id}
                  className={`bg-gradient-to-b ${ncd.color} p-6 rounded-3xl border shadow-sm space-y-4 flex flex-col justify-between`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl bg-white p-2 rounded-2xl shadow-sm block">{ncd.icon}</span>
                      <div>
                        <h3 className="font-display font-bold text-xl leading-none">{ncd.title}</h3>
                        <span className="text-xs opacity-80 mt-1 block font-medium">{ncd.subtitle}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                      {ncd.description}
                    </p>
                  </div>

                  <div className="bg-white/80 p-4 rounded-2xl border border-white/50 space-y-2 mt-4">
                    <span className="text-xs uppercase font-bold tracking-wider flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-emerald-600" />
                      Key Prevention Steps:
                    </span>
                    <ul className="space-y-1.5">
                      {ncd.prevention.map((step, idx) => (
                        <li key={idx} className="text-xs text-gray-700 flex items-start gap-1.5 font-medium">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick general NCD prevention facts */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4">
              <h3 className="font-display font-bold text-2xl flex items-center gap-2">
                🌟 The WHO Health Standard
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                The World Health Organization (WHO) strongly recommends that both adults and children reduce their intake of free sugars to <strong>less than 10% of total energy intake</strong>. A further reduction to <strong>below 5% (approximately 25 grams or 6 teaspoons per day)</strong> provides immense health protections against chronic metabolic diseases.
              </p>
              <div className="border-t border-slate-800 pt-4 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
                <div>• Average American sugar intake: ~77g/day 🚨</div>
                <div>• Healthy targets: under 25g/day ✅</div>
              </div>
            </div>
          </div>

          {/* Right: Daily habit check-offs & Goals tracker preview */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Personal Status Panel */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-lg text-gray-800 flex items-center gap-2">
                <Activity className="text-indigo-500" />
                Active Health Profile
              </h3>
              
              <div className="space-y-3 font-medium text-sm">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Daily Sugar Limit</span>
                  <span className="font-mono text-indigo-600 font-bold">{goals.dailySugarLimitGrams}g / day</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Weight Target</span>
                  <span className="font-mono text-slate-700 font-bold">{goals.targetWeightKg || "Not set"} kg</span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-500 text-xs uppercase block tracking-wider">Preventative Focus</span>
                  {goals.preventativeFocus.length === 0 ? (
                    <span className="text-xs text-gray-400 italic block">No active disease focus set. Go to settings!</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {goals.preventativeFocus.map((f) => (
                        <span key={f} className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full border border-indigo-100">
                          🛡️ {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Daily Preventive Habits List */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-lg text-gray-800 flex items-center justify-between">
                <span>Preventive Habits</span>
                <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-1 rounded-lg">
                  {goals.dailyHabits.filter(h => h.done).length} / {goals.dailyHabits.length}
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Tick these daily steps to actively safeguard your body against metabolic chronic illnesses.
              </p>

              <div className="space-y-3">
                {goals.dailyHabits.map((habit) => (
                  <button
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-full p-3.5 rounded-2xl flex items-center gap-3 border text-left transition-all duration-200 cursor-pointer ${
                      habit.done 
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                        : "bg-gray-50 border-gray-100 hover:border-indigo-200 text-gray-700"
                    }`}
                  >
                    {habit.done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                    )}
                    <span className="text-sm font-semibold leading-snug">{habit.text}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Settings View */
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <h2 className="font-display font-bold text-2xl text-gray-800 flex items-center gap-2">
              <Settings className="text-indigo-500 w-6 h-6" />
              Configure Personal Health Parameters
            </h2>
            <p className="text-sm text-gray-500">
              Customize daily targets and indicate family health history or chronic illness focus so the tracker stays matched to your needs.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* Daily Sugar Limit Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">Daily Sugar Intake Limit (Grams)</label>
                <span className="text-lg font-mono font-bold text-indigo-600">{limitInput}g</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="1"
                value={limitInput}
                onChange={(e) => setLimitInput(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-gray-400 font-medium">
                <span>10g (Ultra Strict)</span>
                <span className="text-indigo-500 font-bold">25g (WHO Recommendation)</span>
                <span>80g (High)</span>
              </div>
            </div>

            {/* Target Weight input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block">Target Body Weight Goal (kg)</label>
              <input
                type="number"
                placeholder="E.g., 70"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="w-full p-3.5 rounded-2xl border-2 border-gray-100 focus:border-indigo-400 focus:outline-none transition-colors font-semibold"
              />
            </div>

            {/* Disease Focus Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 block">
                Preventative Chronic Disease Focus:
              </label>
              <p className="text-xs text-gray-400">
                Select target diseases you want to proactively prevent through strict diet adjustments.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {["Type 2 Diabetes", "Cardiovascular Care", "Obesity Prevention", "Fatty Liver Protection"].map((disease) => {
                  const isSelected = goals.preventativeFocus.includes(disease);
                  return (
                    <button
                      type="button"
                      key={disease}
                      onClick={() => toggleFocus(disease)}
                      className={`p-3 rounded-2xl border-2 font-bold text-xs text-left transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? "bg-indigo-600 border-indigo-700 text-white" 
                          : "bg-gray-50 border-gray-100 hover:border-indigo-200 text-gray-600"
                      }`}
                    >
                      {isSelected ? "🛡️ " : "➕ "} {disease}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save Buttons & Message */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
              <button
                type="submit"
                className="bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-2xl transition-colors cursor-pointer shadow"
              >
                Save Health Parameters
              </button>

              {savedMessage && (
                <p className="text-xs text-emerald-600 font-bold animate-bounce flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Goals updated!
                </p>
              )}
            </div>

          </form>

          {/* Label guide for non-communicable warning signs */}
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex gap-3">
            <AlertCircle className="text-amber-600 shrink-0 w-5 h-5" />
            <div className="text-xs text-amber-800 leading-relaxed">
              <span className="font-bold block mb-1">Pre-diabetic warning signs:</span>
              Excessive thirst, frequent night urination, fatigue, blurred vision, and slow wound healing can indicate elevated systemic sugar stress. Always consult a qualified medical specialist if symptoms persist.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
