export interface CatalogProduct {
  name: string;
  sugarGrams: number;
  servingSize: string;
  category: "low" | "medium" | "high";
  icon: string;
  equivalentTeaspoons: number;
}

export const PRODUCT_CATALOG: CatalogProduct[] = [
  {
    name: "Regular Cola Soda",
    sugarGrams: 39,
    servingSize: "1 can (355ml)",
    category: "high",
    icon: "🥤",
    equivalentTeaspoons: 10
  },
  {
    name: "Apple Juice",
    sugarGrams: 24,
    servingSize: "1 cup (250ml)",
    category: "high",
    icon: "🧃",
    equivalentTeaspoons: 6
  },
  {
    name: "Energy Drink",
    sugarGrams: 27,
    servingSize: "1 can (250ml)",
    category: "high",
    icon: "⚡",
    equivalentTeaspoons: 7
  },
  {
    name: "Flavored Strawberry Yogurt",
    sugarGrams: 19,
    servingSize: "1 tub (150g)",
    category: "high",
    icon: "🍧",
    equivalentTeaspoons: 5
  },
  {
    name: "Chocolate Chip Cookies",
    sugarGrams: 11,
    servingSize: "2 cookies (30g)",
    category: "medium",
    icon: "🍪",
    equivalentTeaspoons: 3
  },
  {
    name: "Banana",
    sugarGrams: 12,
    servingSize: "1 medium banana",
    category: "low",
    icon: "🍌",
    equivalentTeaspoons: 3
  },
  {
    name: "Red Apple",
    sugarGrams: 10,
    servingSize: "1 medium apple",
    category: "low",
    icon: "🍎",
    equivalentTeaspoons: 2.5
  },
  {
    name: "Fresh Strawberries",
    sugarGrams: 5,
    servingSize: "1 cup (150g)",
    category: "low",
    icon: "🍓",
    equivalentTeaspoons: 1
  },
  {
    name: "Plain Oatmeal (Cooked)",
    sugarGrams: 1,
    servingSize: "1 bowl (200g)",
    category: "low",
    icon: "🥣",
    equivalentTeaspoons: 0.2
  },
  {
    name: "Glazed Donut",
    sugarGrams: 15,
    servingSize: "1 donut",
    category: "high",
    icon: "🍩",
    equivalentTeaspoons: 4
  },
  {
    name: "Ketchup",
    sugarGrams: 4,
    servingSize: "1 tablespoon (15g)",
    category: "medium",
    icon: "🍅",
    equivalentTeaspoons: 1
  },
  {
    name: "Pure Water",
    sugarGrams: 0,
    servingSize: "1 glass",
    category: "low",
    icon: "💧",
    equivalentTeaspoons: 0
  }
];
