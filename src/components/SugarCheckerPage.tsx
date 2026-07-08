import React, { useState } from "react";
import { Search, Volume2, AlertTriangle, Check, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { ProductAnalysis } from "../types";
import { PRODUCT_CATALOG, CatalogProduct } from "../data/productCatalog";

interface SugarCheckerPageProps {
  onLogSugar: (name: string, grams: number) => void;
}

export default function SugarCheckerPage({ onLogSugar }: SugarCheckerPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ProductAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loggedNotification, setLoggedNotification] = useState(false);

  const handleAnalyze = async (productNameStr: string) => {
    if (!productNameStr.trim()) return;
    setAnalyzing(true);
    setErrorMsg("");
    setAnalysisResult(null);
    setLoggedNotification(false);

    try {
      const response = await fetch("/api/sugar-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: productNameStr }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed. Please try again.");
      }

      const data = await response.json();
      setAnalysisResult(data);
      // Automatically trigger voice read out for accessibility
      speakResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCatalogSelect = (item: CatalogProduct) => {
    // Generate an instant local result for smooth UX or run API check
    const mappedResult: ProductAnalysis = {
      productName: item.name,
      sugarGrams: item.sugarGrams,
      servingSize: item.servingSize,
      category: item.category,
      explanation: getExplanationForItem(item),
      equivalentTeaspoons: item.equivalentTeaspoons,
      alternatives: getAlternativesForItem(item),
      ncdRisk: getNcdRiskForItem(item)
    };
    setAnalysisResult(mappedResult);
    speakResult(mappedResult);
    setLoggedNotification(false);
  };

  const getExplanationForItem = (item: CatalogProduct) => {
    if (item.category === "high") {
      return `Very high in sugar! Taking this is like putting ${Math.round(item.equivalentTeaspoons)} spoonfulls of pure white sugar directly in your mouth. Limit this to stay healthy!`;
    } else if (item.category === "medium") {
      return `Has moderate sugar levels. It is okay to eat once in a while, but do not eat too much. Balance it with fresh vegetables or water!`;
    }
    return `Excellent choice! This product has very low or zero sugar, or contains natural sugar trapped in healthy fiber. This is totally safe to enjoy!`;
  };

  const getAlternativesForItem = (item: CatalogProduct) => {
    if (item.category === "high") {
      return ["Plain water with lemon juice 🍋", "Fresh whole fruit instead of juice", "Unsweetened herbal tea"];
    } else if (item.category === "medium") {
      return ["Unsweetened oatmeal", "Plain greek yogurt with raw almonds", "Water with mint leaves"];
    }
    return ["Enjoy it as is!", "Mix with plain yogurt", "Pure hydration"];
  };

  const getNcdRiskForItem = (item: CatalogProduct) => {
    if (item.category === "high") {
      return "Heavy consumption can cause high blood pressure, type 2 diabetes, fatty liver syndrome, and increases your risk of chronic cardiovascular issues.";
    } else if (item.category === "medium") {
      return "Eating too much of moderate-sugar snacks still adds up and can slowly trigger metabolic fatigue and slow weight gain.";
    }
    return "This clean food actually works to lower your systemic inflammation, keeping your arteries clean and preventing metabolic chronic illness.";
  };

  const speakResult = (result: ProductAnalysis) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop any current speech
    
    const categoryLabel = result.category === "high" 
      ? "Dangerous, High Sugar level" 
      : result.category === "medium" 
        ? "Caution, Medium Sugar level" 
        : "Safe, Low Sugar level";

    const textToSpeak = `${result.productName}. Sugar category is ${categoryLabel}. It contains ${result.sugarGrams} grams of sugar, which is about ${Math.round(result.equivalentTeaspoons)} teaspoons. ${result.explanation}`;
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95; // Slightly slower for better accessibility
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-8" id="sugar-checker-view">
      {/* Visual Title Header */}
      <div className="bg-gradient-to-r from-amber-400 via-pink-500 to-rose-600 p-8 rounded-3xl text-white shadow-lg text-center md:text-left">
        <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-2">
          🌈 Colorful Sugar Meter
        </h1>
        <p className="text-white/90 max-w-2xl text-base md:text-lg">
          No reading needed! Simple, bright colors indicate if sugar is safe. Red means danger, Orange means careful, and Green is safe for your body!
        </p>
      </div>

      {/* Main Analyzer Search & Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Search & Quick Selection */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-display font-bold text-xl text-gray-800">
              Type & Analyze Any Product
            </h2>
            <p className="text-xs text-gray-500">
              Our advanced AI assistant will decode ingredients for sugar level safety in seconds.
            </p>
            
            <div className="relative">
              <input
                type="text"
                placeholder="E.g., Coca Cola, Strawberry Jam, Apple..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAnalyze(searchQuery);
                }}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-pink-400 focus:outline-none transition-colors font-medium text-gray-700 placeholder:text-gray-400"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            <button
              onClick={() => handleAnalyze(searchQuery)}
              disabled={analyzing || !searchQuery.trim()}
              className="w-full bg-slate-900 hover:bg-pink-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI Decoding Sugar...
                </>
              ) : (
                "Run Smart Sugar Check 🔍"
              )}
            </button>
            {errorMsg && <p className="text-red-500 text-xs text-center font-medium">{errorMsg}</p>}
          </div>

          {/* Quick Selection Grid */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-lg text-gray-800">
              Taps / Quick Library
            </h3>
            <p className="text-xs text-gray-500">
              Tap any food icon below to see its color warning code instantly.
            </p>
            
            <div className="grid grid-cols-3 gap-3">
              {PRODUCT_CATALOG.map((item) => {
                const colorBorder = 
                  item.category === "high" 
                    ? "hover:border-red-400 hover:bg-red-50 text-red-700" 
                    : item.category === "medium" 
                      ? "hover:border-amber-400 hover:bg-amber-50 text-amber-700" 
                      : "hover:border-green-400 hover:bg-green-50 text-green-700";
                
                return (
                  <button
                    key={item.name}
                    onClick={() => handleCatalogSelect(item)}
                    className={`p-3 rounded-2xl border-2 border-gray-50 flex flex-col items-center text-center transition-all duration-200 cursor-pointer ${colorBorder}`}
                  >
                    <span className="text-3xl mb-1">{item.icon}</span>
                    <span className="text-xs font-bold truncate w-full">{item.name}</span>
                    <span className="text-[10px] opacity-75 mt-0.5 font-mono">{item.sugarGrams}g</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive High-Contrast Visualizer Output */}
        <div className="lg:col-span-7 flex flex-col justify-stretch">
          {!analysisResult && !analyzing && (
            <div className="bg-slate-50 border-4 border-dashed border-gray-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center flex-grow">
              <span className="text-6xl mb-4">🥫</span>
              <h3 className="font-display font-bold text-2xl text-gray-700 mb-2">
                Scan Result Center
              </h3>
              <p className="text-gray-500 max-w-md">
                Search a product or click an item in our Quick library to trigger the high-contrast sugar warning.
              </p>
            </div>
          )}

          {analyzing && (
            <div className="bg-white border-2 border-gray-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center flex-grow shadow-sm">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-pink-100 border-t-pink-500 animate-spin"></div>
                <span className="absolute inset-0 flex items-center justify-center text-3xl">🔍</span>
              </div>
              <h3 className="font-display font-bold text-xl text-gray-800 mb-2">
                Analyzing Ingredients Safety
              </h3>
              <p className="text-gray-500 max-w-sm">
                Evaluating grams of sugar and compiling heart & diabetes preventative guidelines...
              </p>
            </div>
          )}

          {analysisResult && !analyzing && (
            <div className="space-y-6 flex-grow flex flex-col">
              
              {/* Massive Main Alert Card - High Color Contrast */}
              <div 
                className={`rounded-3xl p-8 text-white shadow-xl transition-all duration-300 flex-grow flex flex-col ${
                  analysisResult.category === "high" 
                    ? "bg-red-500 red-danger-pulse border-4 border-red-700" 
                    : analysisResult.category === "medium" 
                      ? "bg-amber-500 border-4 border-amber-600" 
                      : "bg-green-500 green-safe-glow border-4 border-green-600"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">
                      {analysisResult.category === "high" ? "🚨" : analysisResult.category === "medium" ? "⚠️" : "💖"}
                    </span>
                    <div>
                      <span className="text-xs uppercase tracking-widest font-bold bg-white/20 px-3 py-1 rounded-full text-white">
                        {analysisResult.category === "high" ? "Danger (High Sugar)" : analysisResult.category === "medium" ? "Caution (Medium Sugar)" : "Safe (Low Sugar)"}
                      </span>
                      <h3 className="font-display font-bold text-3xl mt-1 leading-tight">
                        {analysisResult.productName}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Audible voice guide button */}
                  <button
                    onClick={() => speakResult(analysisResult)}
                    className="bg-white text-slate-900 hover:bg-gray-100 p-3 rounded-full transition-transform hover:scale-105 shadow flex items-center gap-2 cursor-pointer font-bold text-sm"
                    title="Read aloud for non-readers"
                  >
                    <Volume2 className="w-5 h-5 text-pink-600" />
                    <span>Hear Result 🗣️</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/10 p-6 rounded-2xl mb-6">
                  <div>
                    <span className="text-xs text-white/80 uppercase font-mono">Sugar Content</span>
                    <p className="text-5xl font-black font-display tracking-tight mt-1">
                      {analysisResult.sugarGrams}g
                    </p>
                    <span className="text-sm block mt-1 text-white/90 font-medium">
                      Per serving: {analysisResult.servingSize}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-white/80 uppercase font-mono">Visual Teaspoons</span>
                    <p className="text-5xl font-black font-display tracking-tight mt-1">
                      {Math.round(analysisResult.equivalentTeaspoons)} 🥄
                    </p>
                    <span className="text-sm block mt-1 text-white/90 font-medium">
                      Equivalent spoonfulls of pure sugar
                    </span>
                  </div>
                </div>

                {/* Physical representation of sugar spoons (Visual Aid for Non-readers) */}
                <div className="bg-white/10 p-5 rounded-2xl mb-6">
                  <p className="text-xs text-white/80 uppercase font-bold mb-3">
                    Visual Sugar Cube Count:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: Math.max(1, Math.round(analysisResult.equivalentTeaspoons)) }).map((_, i) => (
                      <span 
                        key={i} 
                        className="text-3xl bg-white p-2 rounded-xl shadow-sm block hover:scale-110 transition-transform"
                        title={`Sugar cube ${i + 1}`}
                      >
                        ⬜️
                      </span>
                    ))}
                    {analysisResult.sugarGrams === 0 && (
                      <span className="text-sm font-bold text-white/90">
                        Zero Added Sugar Cubes! 🚫⬜️
                      </span>
                    )}
                  </div>
                </div>

                {/* Explanation in accessible friendly words */}
                <div className="bg-white p-5 rounded-2xl text-slate-800 space-y-3 mt-auto shadow-sm">
                  <p className="font-bold text-base leading-snug flex items-start gap-2">
                    <span className="text-xl">💡</span>
                    <span>{analysisResult.explanation}</span>
                  </p>
                </div>
              </div>

              {/* Alternatives & NCD Relation Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Alternatives */}
                <div className="bg-emerald-50 border-2 border-emerald-100 p-6 rounded-3xl">
                  <h4 className="font-display font-bold text-lg text-emerald-800 mb-3 flex items-center gap-2">
                    <ShieldCheck className="text-emerald-600" />
                    Healthy Swaps:
                  </h4>
                  <ul className="space-y-2">
                    {analysisResult.alternatives.map((alt, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-emerald-900 font-medium bg-white/60 p-2 rounded-xl">
                        <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
                        {alt}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Action Logging */}
                <div className="bg-slate-900 p-6 rounded-3xl text-white flex flex-col justify-between">
                  <div>
                    <h4 className="font-display font-bold text-lg mb-2">
                      Did you consume this?
                    </h4>
                    <p className="text-xs text-slate-300">
                      Instantly log this into your daily tracker to keep count against your health goals.
                    </p>
                  </div>

                  <div className="mt-4">
                    {loggedNotification ? (
                      <div className="bg-green-600 text-white font-bold p-3 rounded-2xl flex items-center justify-center gap-2 text-sm animate-bounce">
                        <Check className="w-5 h-5" />
                        Log Added Successfully!
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          onLogSugar(analysisResult.productName, analysisResult.sugarGrams);
                          setLoggedNotification(true);
                        }}
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-2xl transition-all cursor-pointer text-sm"
                      >
                        Add to Daily Tracker +
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Disease Info Box */}
              <div className="bg-pink-50 border border-pink-100 p-6 rounded-3xl">
                <h4 className="font-display font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="text-pink-500 w-5 h-5" />
                  Understanding the Connection to NCDs
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {analysisResult.ncdRisk}
                </p>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
