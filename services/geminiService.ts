import { GoogleGenAI, Type } from "@google/genai";
import { HeaderDesign } from "../types";

export const generateHeaderDesignVariations = async (
  apiKey: string,
  sector: string, 
  description: string, 
  language: 'en' | 'tr',
  userPrefs: { 
    style: string, 
    mechanic: string,
    isSticky: boolean, 
    hasBlur: boolean, 
    logoType: 'text' | 'image',
    logoContent: string 
  }
): Promise<HeaderDesign[]> => {
  const ai = new GoogleGenAI({ apiKey });
  
  const langPrompt = language === 'tr' 
    ? "Lütfen tüm menü öğelerini, buton metinlerini ve tasarım özetlerini TÜRKÇE olarak oluştur." 
    : "Please generate all menu items, button texts, and design summaries in ENGLISH.";

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a world-class UI Designer specialized in Elementor Pro and ElementsKit. Create 4 ARCHETYPAL header designs for a '${sector}' website.

    DESIGN ARCHETYPES (MUST USE ALL 4):
    1. "THE ENTERPRISE (Dual-Bar)": Top bar (bgColor: Primary or Neutral) with Phone/Email/Socials. Main bar (White/Clean) with logo left and navigation right. Professional, heavy on info.
    2. "THE MODERN SAAS (Floating Pill)": Full-width, but nav container is a detached pill (100px radius). Needs 'backdrop-filter: blur(15px)'. Ultra-minimal.
    3. "THE BOUTIQUE (Split-Menu)": Logo is strictly CENTERED. Navigation items are split: half on the left, half on the right. High-end fashion/luxury vibe.
    4. "THE BOLD ACTION": Solid bold background (e.g. #2575FC). White heavy typography. Oversized CTA button. Action-oriented (Software V1 style).

    TECHNICAL PARAMETERS:
    - User Request: ${description}
    - Custom Style: ${userPrefs.style}
    - Language: ${language.toUpperCase()}
    ${langPrompt}

    DESIGN RULES:
    - Typography: Use 'Inter' (Clean), 'Outfit' (Modern), 'Montserrat' (Classic), 'Poppins' (Soft), 'Rajdhani' (Tech), or 'Jost' (Elegant).
    - Colors: Use premium palettes (e.g., deep neons, luxury muted golds, or clean monochrome).
    - Navigation: 4-6 highly relevant menu items for the '${sector}' industry.
    - Layout Property: You MUST set the 'layout' field to exactly one of: 'left-logo', 'center-logo', 'split-menu', 'floating-pill', 'dual-bar'.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            sector: { type: Type.STRING },
            style: { type: Type.STRING },
            fontFamily: { type: Type.STRING },
            mechanicSummary: { type: Type.STRING },
            colors: {
              type: Type.OBJECT,
              properties: {
                primary: { type: Type.STRING },
                secondary: { type: Type.STRING },
                text: { type: Type.STRING },
                background: { type: Type.STRING }
              },
              required: ["primary", "secondary", "text", "background"]
            },
            logo: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                content: { type: Type.STRING }
              },
              required: ["type", "content"]
            },
            navigation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  url: { type: Type.STRING }
                }
              }
            },
            cta: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                url: { type: Type.STRING },
                style: { type: Type.STRING }
              }
            },
            topBar: {
              type: Type.OBJECT,
              properties: {
                phone: { type: Type.STRING },
                email: { type: Type.STRING },
                socials: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            layout: { type: Type.STRING },
            isSticky: { type: Type.BOOLEAN },
            hasBlur: { type: Type.BOOLEAN }
          },
          required: ["sector", "style", "fontFamily", "mechanicSummary", "colors", "logo", "navigation", "isSticky", "hasBlur", "layout"]
        }
      }
    }
  });

  return JSON.parse(response.text.trim());
};