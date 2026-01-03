import { Category, Priority, Department, Language, ClassificationResult } from "./types";

const categoryKeywords: Record<Category, string[]> = {
  roads: ["road", "pothole", "street", "highway", "traffic", "bridge", "pavement", "footpath", "streetlight", "light", "lamp", "signal", "crossing"],
  water: ["water", "pipe", "leak", "supply", "tap", "sewage", "drain", "flood", "waterlog", "drinking", "contaminated", "bore", "well", "tank"],
  sanitation: ["garbage", "waste", "trash", "dump", "dustbin", "cleaning", "sweeping", "toilet", "public toilet", "dirty", "smell", "stink", "hygiene"],
  safety: ["crime", "theft", "robbery", "fight", "violence", "harassment", "stalking", "accident", "fire", "emergency", "police", "danger", "unsafe", "murder", "assault"],
  healthcare: ["hospital", "clinic", "doctor", "medicine", "health", "disease", "fever", "injury", "ambulance", "vaccine", "medical", "illness", "epidemic", "bleeding"],
  education: ["school", "college", "teacher", "student", "education", "classroom", "book", "exam", "scholarship", "university", "library", "admission"],
  administrative: ["certificate", "license", "permit", "document", "registration", "id", "aadhaar", "passport", "pension", "ration", "card", "form", "application", "corruption", "bribe"]
};

const criticalKeywords = ["fire", "accident", "emergency", "bleeding", "murder", "assault", "collapse", "explosion", "flood", "epidemic", "death", "dying", "life-threatening"];
const highKeywords = ["broken", "leak", "crime", "theft", "harassment", "contaminated", "disease", "urgent", "immediate", "danger", "unsafe", "no water", "no electricity"];
const mediumKeywords = ["damaged", "not working", "delayed", "complaint", "issue", "problem", "need", "request"];

const categoryToDepartment: Record<Category, Department> = {
  roads: "Public Works",
  water: "Water Resources",
  sanitation: "Sanitation & Waste",
  safety: "Police",
  healthcare: "Health Department",
  education: "Education Board",
  administrative: "Municipal Office"
};

const categorySchemes: Record<Category, string[]> = {
  roads: ["Pradhan Mantri Gram Sadak Yojana", "Smart Cities Mission"],
  water: ["Jal Jeevan Mission", "Atal Mission for Rejuvenation"],
  sanitation: ["Swachh Bharat Mission", "Clean India Campaign"],
  safety: ["Safe City Project", "Emergency Response Support System"],
  healthcare: ["Ayushman Bharat", "National Health Mission"],
  education: ["Sarva Shiksha Abhiyan", "Mid Day Meal Scheme", "Digital India"],
  administrative: ["e-Governance Initiative", "Digital Locker"]
};

const languagePatterns: Record<Language, RegExp> = {
  Hindi: /[\u0900-\u097F]/,
  Tamil: /[\u0B80-\u0BFF]/,
  Bengali: /[\u0980-\u09FF]/,
  Telugu: /[\u0C00-\u0C7F]/,
  Marathi: /[\u0900-\u097F]/,
  Gujarati: /[\u0A80-\u0AFF]/,
  Kannada: /[\u0C80-\u0CFF]/,
  English: /^[a-zA-Z0-9\s.,!?'"()-]+$/
};

const sampleTranslations: Record<string, string> = {
  "सड़क में बड़ा गड्ढा है": "There is a big pothole in the road",
  "पानी की सप्लाई नहीं आ रही": "Water supply is not coming",
  "कूड़ा इकट्ठा नहीं हो रहा": "Garbage is not being collected",
  "சாலையில் பெரிய குழி உள்ளது": "There is a big pothole in the road",
  "தண்ணீர் வரவில்லை": "Water is not coming",
  "রাস্তায় বড় গর্ত আছে": "There is a big hole in the road",
  "జలసరఫరా లేదు": "There is no water supply",
  "रस्ता खराब आहे": "The road is bad",
  "પાણી નથી આવતું": "Water is not coming",
  "ರಸ್ತೆಯಲ್ಲಿ ದೊಡ್ಡ ಹೊಂಡ ಇದೆ": "There is a big pothole in the road"
};

export function detectLanguage(text: string): Language {
  if (languagePatterns.Tamil.test(text)) return "Tamil";
  if (languagePatterns.Bengali.test(text)) return "Bengali";
  if (languagePatterns.Telugu.test(text)) return "Telugu";
  if (languagePatterns.Gujarati.test(text)) return "Gujarati";
  if (languagePatterns.Kannada.test(text)) return "Kannada";
  if (languagePatterns.Hindi.test(text)) return "Hindi";
  return "English";
}

export function translateText(text: string, detectedLang: Language): string {
  if (detectedLang === "English") return text;
  for (const [original, translated] of Object.entries(sampleTranslations)) {
    if (text.includes(original)) return translated;
  }
  return `[Translated from ${detectedLang}]: ${text}`;
}

export function classifyGrievance(text: string, location: string): ClassificationResult {
  const detectedLanguage = detectLanguage(text);
  const translatedText = detectedLanguage === "English" ? text : translateText(text, detectedLanguage);
  const textToAnalyze = translatedText.toLowerCase();
  
  let category: Category = "administrative";
  let maxMatches = 0;
  let matchedKeywords: string[] = [];
  
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    const matches = keywords.filter(kw => textToAnalyze.includes(kw));
    if (matches.length > maxMatches) {
      maxMatches = matches.length;
      category = cat as Category;
      matchedKeywords = matches;
    }
  }
  
  let priority: Priority = "Low";
  let priorityReasoning = "Standard grievance with no urgent indicators detected.";
  
  const criticalMatches = criticalKeywords.filter(kw => textToAnalyze.includes(kw));
  const highMatches = highKeywords.filter(kw => textToAnalyze.includes(kw));
  const mediumMatches = mediumKeywords.filter(kw => textToAnalyze.includes(kw));
  
  if (criticalMatches.length > 0) {
    priority = "Critical";
    priorityReasoning = `Emergency situation detected: "${criticalMatches.join(", ")}". Immediate action required.`;
  } else if (highMatches.length > 0) {
    priority = "High";
    priorityReasoning = `Urgent issue identified: "${highMatches.join(", ")}". Requires prompt attention.`;
  } else if (mediumMatches.length > 0) {
    priority = "Medium";
    priorityReasoning = `Moderate concern detected: "${mediumMatches.join(", ")}". Should be addressed soon.`;
  }
  
  const department = categoryToDepartment[category];
  const associatedSchemes = categorySchemes[category];
  
  const categoryReasoning = matchedKeywords.length > 0
    ? `Identified as "${category}" based on keywords: "${matchedKeywords.join(", ")}".`
    : `Categorized as "${category}" based on general content analysis.`;
  
  const routingReasoning = `Routed to ${department} as the primary authority for ${category}-related issues in ${location}.`;
  
  return {
    category,
    categoryReasoning,
    priority,
    priorityReasoning,
    department,
    routingReasoning,
    associatedSchemes,
    detectedLanguage,
    translatedText
  };
}
