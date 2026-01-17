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
    contents: `You are a High-End Web Designer and Elementor Pro expert. Inspired by ElementsKit and modern UI trends (SaaS, Luxury, Minimalist), create 4 DIFFERENT header designs.

    PARAMETERS:
    - Sector: ${sector}
    - User Request: ${description}
    - Style: ${userPrefs.style}
    - Technical: ${userPrefs.isSticky ? 'Sticky' : 'Static'}, ${userPrefs.hasBlur ? 'Blur Enabled' : 'Blur Disabled'}
    - Language: ${language.toUpperCase()}

    ${langPrompt}

    DESIGN APPROACHES:
    1. "The Minimalist": Very thin fonts, wide letter-spacing, fully transparent background, logo on the left.
    2. "The Floating Pill": Detached from the top, capsule-shaped, thin borders, with blur effect.
    3. "The Centered Identity": Centered logo, menu items balanced on left and right (Split menu), premium feel.
    4. "The Action Oriented": Prominent CTA button on the right, thin top bar (double-row) for social icons or brief contact info.

    RULES:
    - Typography: Avoid chunky fonts. Use 'Inter', 'Outfit', or 'Plus Jakarta Sans'. Weights between 400-600.
    - Colors: Choose modern palettes matching the sector.
    - Content: Menu items and CTA text must be strictly relevant to the '${sector}' sector in ${language.toUpperCase()}.
    - Blur: If blur is enabled, use 'backdrop-filter: blur(10px)'.`,
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
          required: ["sector", "style", "fontFamily", "mechanicSummary", "colors", "logo", "navigation", "isSticky", "hasBlur"]
        }
      }
    }
  });

  return JSON.parse(response.text.trim());
};