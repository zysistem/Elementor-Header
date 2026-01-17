import { GoogleGenAI, Type } from "@google/genai";
import { HeaderDesign } from "../types";

export const generateHeaderDesignVariations = async (
  apiKey: string,
  sector: string, 
  description: string, 
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
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Bir UI/UX ve Elementor Pro uzmanı olarak 4 FARKLI ve MODERN header tasarımı yap.
    
    PARAMETRELER:
    - Sektör: ${sector}
    - Ek Bilgi: ${description}
    - Ana Tema: ${userPrefs.style}
    - Baskın Mekanik: ${userPrefs.mechanic} (Bu mekaniği tüm varyasyonlara farklı şekillerde yedir)
    - Logo: ${userPrefs.logoType} (${userPrefs.logoContent})
    - Teknik: ${userPrefs.isSticky ? 'Sticky' : 'Static'}, ${userPrefs.hasBlur ? 'Glassmorphism' : 'Flat'}

    TASARIM ÇEŞİTLİLİĞİ KURALLARI:
    1. Varyasyon 1: Klasik Modern (Logo solda, Menü ortada, CTA sağda).
    2. Varyasyon 2: Floating Minimal (Konteyner kenarlardan boşluklu, rounded-full, havada asılı gibi).
    3. Varyasyon 3: Bold Split (Logo ortada, menü ikiye bölünmüş veya sol tarafa yaslanmış, dramatik renkler).
    4. Varyasyon 4: Neo-Glass (Yüksek blur, ince border gradient, fütüristik).

    ÇIKTI: Sadece JSON listesi. Renkler HEX veya RGBA olmalı.
    Elementor Flex Container sistemine uygun yapılar öner.`,
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
          required: ["sector", "style", "colors", "logo", "navigation", "isSticky", "hasBlur"]
        }
      }
    }
  });

  return JSON.parse(response.text.trim());
};