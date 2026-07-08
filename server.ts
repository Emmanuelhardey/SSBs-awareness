import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header for telemetry
const ai = process.env.GEMINI_API_KEY 
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    })
  : null;

// File-based persistence for Forum Posts
const FORUM_FILE = path.join(process.cwd(), "forum_posts.json");

const DEFAULT_POSTS = [
  {
    id: "1",
    author: "Grace Adebayo",
    avatar: "👩🏾‍⚕️",
    role: "Health Coach",
    content: "Hi everyone! Did you know a single can of soda contains about 10 teaspoons of sugar? That's already exceeding the daily recommended limit for an adult! Let's swap sodas for sparkling water with lemon this week. 🍋",
    likes: 18,
    progressGrams: -15,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    tips: ["Sparkling water + lemon slice", "Infused water with mint"]
  },
  {
    id: "2",
    author: "Moussa Diop",
    avatar: "🏃🏾",
    role: "Community Member",
    content: "I successfully stayed under my 25g sugar limit for 5 days straight! Feeling so much more energetic. Cutting out packaged fruit juices was key. Eating fresh oranges instead is much more satisfying. 🍊",
    likes: 12,
    progressGrams: -20,
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    tips: ["Eat fresh whole fruits", "Avoid processed juice packets"]
  },
  {
    id: "3",
    author: "Dr. Ken Tanaka",
    avatar: "👨🏻‍⚕️",
    role: "Nutrition Specialist",
    content: "Reducing sugar isn't just about weight—it reduces chronic low-grade inflammation. This significantly lowers your risk for Type 2 Diabetes and Cardiovascular diseases. Keep tracking your progress!",
    likes: 24,
    progressGrams: -5,
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    tips: ["Check food labels for 'Added Sugars'", "Avoid condiments like commercial ketchup"]
  }
];

function readPosts() {
  try {
    if (fs.existsSync(FORUM_FILE)) {
      const data = fs.readFileSync(FORUM_FILE, "utf-8");
      return JSON.parse(data);
    } else {
      fs.writeFileSync(FORUM_FILE, JSON.stringify(DEFAULT_POSTS, null, 2));
      return DEFAULT_POSTS;
    }
  } catch (error) {
    console.error("Error reading forum posts:", error);
    return DEFAULT_POSTS;
  }
}

function writePosts(posts: any[]) {
  try {
    fs.writeFileSync(FORUM_FILE, JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error("Error writing forum posts:", error);
  }
}

// --- API ROUTES ---

// Forum - Get Posts
app.get("/api/forum", (req, res) => {
  const posts = readPosts();
  res.json(posts);
});

// Forum - Create Post
app.post("/api/forum", (req, res) => {
  const { author, avatar, role, content, tips, progressGrams } = req.body;
  if (!author || !content) {
    return res.status(400).json({ error: "Author and content are required." });
  }

  const posts = readPosts();
  const newPost = {
    id: String(Date.now()),
    author,
    avatar: avatar || "👤",
    role: role || "Community Member",
    content,
    likes: 0,
    progressGrams: Number(progressGrams) || 0,
    timestamp: new Date().toISOString(),
    tips: Array.isArray(tips) ? tips : []
  };

  posts.unshift(newPost);
  writePosts(posts);
  res.status(201).json(newPost);
});

// Forum - Like Post
app.post("/api/forum/:id/like", (req, res) => {
  const { id } = req.params;
  const posts = readPosts();
  const post = posts.find((p: any) => p.id === id);
  if (post) {
    post.likes = (post.likes || 0) + 1;
    writePosts(posts);
    res.json(post);
  } else {
    res.status(404).json({ error: "Post not found" });
  }
});

// Product Sugar Analyzer via Gemini
app.post("/api/sugar-analyze", async (req, res) => {
  const { productName } = req.body;
  if (!productName) {
    return res.status(400).json({ error: "Product name is required." });
  }

  if (!ai) {
    // Fallback Mock Analyzer if API Key is not set yet
    console.warn("No Gemini API key available. Using high-quality rule-based fallback.");
    const nameLower = productName.toLowerCase();
    
    let sugarGrams = 8;
    let servingSize = "100g";
    let category = "medium";
    let explanation = "Contains moderate natural sugars. Safe in moderation!";
    let equivalentTeaspoons = 2;
    let alternatives = ["Water", "Fresh lime juice", "Unsweetened herbal tea"];
    let ncdRisk = "Moderate intake does not pose major risks. Excess can contribute to metabolic fatigue.";

    if (nameLower.includes("coca") || nameLower.includes("coke") || nameLower.includes("soda") || nameLower.includes("fanta") || nameLower.includes("sprite") || nameLower.includes("pepsi")) {
      sugarGrams = 39;
      servingSize = "1 can (355ml)";
      category = "high";
      explanation = "Extremely high in refined sugar! One can exceeds an entire day's recommended sugar intake. It digests very fast and causes high insulin spikes.";
      equivalentTeaspoons = 10;
      alternatives = ["Sparkling water with lemon", "Unsweetened iced tea", "Fruit-infused water"];
      ncdRisk = "Regular consumption heavily increases the risk of Type 2 Diabetes, Fatty Liver Disease, Obesity, and Tooth Decay.";
    } else if (nameLower.includes("apple juice") || nameLower.includes("orange juice") || nameLower.includes("juice")) {
      sugarGrams = 24;
      servingSize = "1 glass (250ml)";
      category = "high";
      explanation = "Juices lack natural fiber, causing the high amount of fruit sugar (fructose) to flood your body quickly, similar to soda.";
      equivalentTeaspoons = 6;
      alternatives = ["Whole fresh orange", "Infused cucumber water", "Diluted juice (80% water)"];
      ncdRisk = "High fructose intake without fiber strains the liver and can lead to Insulin Resistance and Obesity.";
    } else if (nameLower.includes("yogurt") || nameLower.includes("yoghurt")) {
      sugarGrams = 19;
      servingSize = "1 cup (150g)";
      category = "high";
      explanation = "Flavored yogurts often have lots of added syrups to make them taste like candy. Plain yogurt with real fruit is much safer.";
      equivalentTeaspoons = 5;
      alternatives = ["Plain Greek yogurt", "Yogurt with real strawberry slices", "Kefir"];
      ncdRisk = "Added sugars in dairy can secretly accumulate, increasing daily calorie loads and elevating diabetes risks.";
    } else if (nameLower.includes("apple") || nameLower.includes("orange") || nameLower.includes("strawberry") || nameLower.includes("banana") || nameLower.includes("watermelon") || nameLower.includes("fruit")) {
      sugarGrams = 12;
      servingSize = "1 medium fruit";
      category = "low";
      explanation = "Contains natural sugars but is packed with healthy fibers, vitamins, and water which slow down digestion. Very safe and highly recommended!";
      equivalentTeaspoons = 3;
      alternatives = ["Eat as is!", "Pair with raw almonds for slower absorption", "Mix into a fresh salad"];
      ncdRisk = "Whole fruits are rich in antioxidants and fibers that help PREVENT heart disease and diabetes, counteracting the sugar.";
    } else if (nameLower.includes("cookie") || nameLower.includes("biscuit") || nameLower.includes("cake") || nameLower.includes("chocolate") || nameLower.includes("candy") || nameLower.includes("sweet")) {
      sugarGrams = 32;
      servingSize = "3 cookies (50g)";
      category = "high";
      explanation = "Highly processed cookies are loaded with added table sugar and refined flour, which turn into sugar instantly in your body.";
      equivalentTeaspoons = 8;
      alternatives = ["Oatmeal biscuits with no added sugar", "A square of 85% Dark Chocolate", "A handful of walnuts and raisins"];
      ncdRisk = "Creates rapid blood glucose spikes, promotes weight gain, and increases risk of cardiovascular disease and metabolic syndrome.";
    } else if (nameLower.includes("water") || nameLower.includes("tea") || nameLower.includes("coffee") && !nameLower.includes("sweet")) {
      sugarGrams = 0;
      servingSize = "1 glass / cup";
      category = "low";
      explanation = "Completely sugar-free! This is the gold standard for hydration. Excellent for your body.";
      equivalentTeaspoons = 0;
      alternatives = ["Add a slice of cucumber", "Add a drop of mint extract", "Add lemon slices"];
      ncdRisk = "No sugar means zero risk for NCDs. In fact, clean hydration actively prevents metabolic diseases!";
    }

    return res.json({
      productName,
      sugarGrams,
      servingSize,
      category,
      explanation,
      equivalentTeaspoons,
      alternatives,
      ncdRisk
    });
  }

  try {
    const prompt = `Analyze the sugar content of the following product: "${productName}". 
Provide a detailed response about its sugar content, standard serving size, safety level classification (low, medium, or high), a simple visual description, equivalent teaspoons of sugar, low-sugar alternatives, and the associated risks regarding Non-Communicable Diseases (NCDs) like Diabetes and Heart Disease. 
Ensure the explanation is simple, extremely clear, colorful, and suitable for users who might struggle with complex medical concepts. Ensure the language is friendly.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            sugarGrams: { type: Type.NUMBER, description: "Grams of sugar in a typical serving. Round to nearest integer." },
            servingSize: { type: Type.STRING, description: "E.g., '1 can (355ml)', '100g', '2 biscuits'" },
            category: { 
              type: Type.STRING, 
              enum: ["low", "medium", "high"],
              description: "Use 'low' for sugar under 5g per serving, 'medium' for 5-15g, and 'high' for above 15g." 
            },
            explanation: { type: Type.STRING, description: "Keep it simple, clear, and highly supportive. Explain exactly why this amount of sugar is low, moderate, or too high for the body." },
            equivalentTeaspoons: { type: Type.NUMBER, description: "1 teaspoon is about 4 grams of sugar. Calculate sugarGrams divided by 4." },
            alternatives: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List 3 healthy, low-sugar alternatives that satisfy a similar craving."
            },
            ncdRisk: { type: Type.STRING, description: "Relate this product's sugar level directly to NCDs like Diabetes, Obesity, or cardiovascular diseases in easy-to-understand terms." }
          },
          required: ["productName", "sugarGrams", "servingSize", "category", "explanation", "equivalentTeaspoons", "alternatives", "ncdRisk"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini API");
    }

    const data = JSON.parse(resultText.trim());
    res.json(data);
  } catch (error) {
    console.error("Gemini Sugar Analyzer Error:", error);
    res.status(500).json({ error: "Failed to analyze product sugar content. Please try again." });
  }
});

// Setup Vite Dev server or static serve
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
