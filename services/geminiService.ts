
import { GoogleGenAI, Type } from "@google/genai";
import { HeaderDesign } from "../types";

export const generateHeaderDesignVariations = async (
  sector: string, 
  description: string, 
  userPrefs: { 
    style: string, 
    isSticky: boolean, 
    hasBlur: boolean, 
    logoType: 'text' | 'image',
    logoContent: string 
  }
): Promise<HeaderDesign[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Bir Elementor Pro ve UI/UX uzmanı olarak hareket et. 
    Modern WordPress "FLEX CONTAINER" sistemine tam uyumlu 2 FARKLI header varyasyonu tasarla.
    
    PARAMETRELER:
    - Sektör: ${sector}
    - Kullanıcı Notu: ${description}
    - Genel Stil: ${userPrefs.style}
    - Logo Tipi: ${userPrefs.logoType}
    - Logo İçeriği: ${userPrefs.logoContent}
    - Teknik Tercihler: ${userPrefs.isSticky ? 'Sticky (Sabit)' : 'Normal'}, ${userPrefs.hasBlur ? 'Blur (Buzlu)' : 'Düz'}

    Varyasyon Kuralları:
    1. Varyasyon 1: Ultra Modern & Minimalist (Temiz çizgiler, geniş harf boşlukları).
    2. Varyasyon 2: Premium & Şık (Göz alıcı renk paleti ve modern gölgeler).
    3. Her tasarım benzersiz bir renk paleti ve navigasyon yapısı sunmalı.
    4. Renk paletlerini Elementor'da göze çarpan modern tonlardan seç.

    Yanıtını sadece aşağıdaki JSON şemasında (bir dizi olarak) ver:
    [
      {
        "sector": "${sector}",
        "style": "minimal/modern/corporate/creative",
        "colors": {
          "primary": "HEX",
          "secondary": "HEX",
          "text": "HEX",
          "background": "HEX"
        },
        "logo": { "type": "${userPrefs.logoType}", "content": "${userPrefs.logoContent || 'BRAND'}" },
        "navigation": [{"label": "HOME", "url": "#"}, {"label": "SERVICES", "url": "#"}, {"label": "ABOUT", "url": "#"}, {"label": "CONTACT", "url": "#"}],
        "cta": { "text": "RESERVE", "url": "#", "style": "button" },
        "layout": "left-logo",
        "isSticky": ${userPrefs.isSticky},
        "hasBlur": ${userPrefs.hasBlur}
      }
    ]`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            sector: { type: Type.STRING },
            style: { type: Type.STRING },
            colors: {
              type: Type.OBJECT,
              properties: {
                primary: { type: Type.STRING },
                secondary: { type: Type.STRING },
                text: { type: Type.STRING },
                background: { type: Type.STRING }
              }
            },
            logo: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                content: { type: Type.STRING }
              }
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
          required: ["sector", "style", "colors", "logo", "navigation", "isSticky", "hasBlur"]
        }
      }
    }
  });

  return JSON.parse(response.text.trim());
};
