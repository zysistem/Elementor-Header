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
    contents: `You are a specialized Elementor Pro and ElementsKit developer. You must generate 4 DIFFERENT header variations based on these exact structural patterns:

    1. "The Software Layout" (V1): Bold primary background (e.g., #6937CE), white text, rounded CTA buttons (10px), centered navigation, strictly modern.
    2. "The Dual-Bar Professional" (V2): A top bar containing info (phone/email) and social icons, with a clean white main navigation bar below. Professional and informative.
    3. "The Centered Identity" (V3): Centered logo with menu items split or balanced on both sides. High-end aesthetic, often used in luxury or fashion.
    4. "The High-Tech Glass" (V4): Full-width, semi-transparent background with mandatory 'backdrop-filter: blur(10px)'. Floating pill-shaped container or standard full-width with thin borders.

    PARAMETERS:
    - Sector: ${sector}
    - Custom Notes: ${description}
    - Style: ${userPrefs.style}
    - Technical: ${userPrefs.isSticky ? 'Sticky' : 'Static'}, ${userPrefs.hasBlur ? 'Blur 10px' : 'No Blur'}
    - Language: ${language.toUpperCase()}

    ${langPrompt}

    RULES:
    - Typography: Use 'Inter', 'Outfit', 'Montserrat', 'Poppins', 'Roboto', or 'Jost'. No chunky fonts.
    - Content: Menu items and CTA must be highly relevant to ${sector}.
    - Structure: For Elementor Flex Containers. Use the 'layout' field to specify: 'left-logo', 'center-logo', 'split-menu', or 'floating-pill'.`,
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