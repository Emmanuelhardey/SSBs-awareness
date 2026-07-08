export interface ProductAnalysis {
  productName: string;
  sugarGrams: number;
  servingSize: string;
  category: "low" | "medium" | "high";
  explanation: string;
  equivalentTeaspoons: number;
  alternatives: string[];
  ncdRisk: string;
}

export interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  role: string;
  content: string;
  likes: number;
  progressGrams: number;
  timestamp: string;
  tips: string[];
}

export interface SugarLog {
  id: string;
  productName: string;
  sugarGrams: number;
  quantity: number;
  timestamp: string;
}

export interface HealthGoals {
  dailySugarLimitGrams: number;
  targetWeightKg: string;
  preventativeFocus: string[]; // e.g. "Diabetes", "Hypertension", "Heart Health", "Obesity Prevention"
  dailyHabits: { id: string; text: string; done: boolean }[];
}
