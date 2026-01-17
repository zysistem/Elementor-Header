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
    contents: `Sen bir Elementor Pro ve Modern UI Tasarımcısısın. 
    WordPress "FLEX CONTAINER" yapısına tam uyumlu 4 FARKLI ve benzersiz header varyasyonu oluştur.
    
    PARAMETRELER:
    - Sektör: ${sector}
    - Kullanıcı Notu: ${description}
    - Stil: ${userPrefs.style}
    - Logo: ${userPrefs.logoType} (${userPrefs.logoContent})
    - Teknik: ${userPrefs.isSticky ? 'Sticky' : 'Static'}, ${userPrefs.hasBlur ? 'Glassmorphism' : 'Flat'}

    MEKANİK KURALLARI (Her tasarımda bunlardan birini baskın kullan):
    1. Glassmorphism: Yüksek blur, ince beyaz border, yarı saydamlık.
    2. Neo-Brutalism: Keskin köşeler, sert gölgeler, yüksek kontrast.
    3. Minimal Luxury: Geniş boşluklar, ince fontlar, sadece vurgu renkleri.
    4. Gradient Fusion: Renkli borderlar veya buton geçişleri.

    ÇIKTI FORMATI: Sadece JSON listesi ver. Renkler HEX formatında olsun.
    Arka plan rengi blur varsa mutlaka RGBA veya HEX + opacity (Örn: #000000CC) olmalı.`,
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