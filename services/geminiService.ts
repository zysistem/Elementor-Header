
import { GoogleGenAI, Type } from "@google/genai";
import { HeaderDesign } from "../types";

export const generateHeaderDesign = async (
  sector: string, 
  description: string, 
  userPrefs: { 
    style: string, 
    isSticky: boolean, 
    hasBlur: boolean, 
    logoType: 'text' | 'image',
    logoContent: string 
  }
): Promise<HeaderDesign> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Bir Elementor Pro ve UI/UX uzmanı olarak hareket et. 
    Modern WordPress "FLEX CONTAINER" sistemine tam uyumlu bir header tasarla.
    
    PARAMETRELER:
    - Sektör: ${sector}
    - Kullanıcı Notu: ${description}
    - Stil: ${userPrefs.style} (Minimal/Modern odaklı)
    - Logo: ${userPrefs.logoType} (${userPrefs.logoContent})
    - Özellikler: ${userPrefs.isSticky ? 'Sticky' : 'Normal'}, ${userPrefs.hasBlur ? 'Blur/Glassmorphism' : 'Katı Renk'}

    TASARIM STANDARTLARI:
    1. Renkler: Lüks ve modern hissettirmeli (Örn: Derin gri #1a1a1a, Altın tonları #c5a059, Saf beyaz #ffffff).
    2. Tipografi: Inter veya benzeri sans-serif fontlar için uygun "uppercase" ve "tracking" (harf boşluğu) ayarları öner.
    3. Container Yapısı: İçerik "Space-Between" yayılmalı.
    4. Navigasyon: Menü öğeleri kısa ve etkili olmalı (HOME, ROOMS, GALLERY, CONTACT).

    Yanıtını sadece aşağıdaki JSON şemasında ver:
    {
      "sector": "${sector}",
      "style": "${userPrefs.style}",
      "colors": {
        "primary": "HEX kodu (CTA butonu için)",
        "secondary": "HEX kodu",
        "text": "HEX kodu (Menü yazıları için)",
        "background": "HEX kodu (Header arka planı için)"
      },
      "logo": {
        "type": "${userPrefs.logoType}",
        "content": "${userPrefs.logoContent || 'BRAND'}"
      },
      "navigation": [
        {"label": "HOME", "url": "#"},
        {"label": "OUR ROOMS", "url": "#"},
        {"label": "ACTIVITIES", "url": "#"},
        {"label": "GALLERY", "url": "#"},
        {"label": "CONTACT US", "url": "#"}
      ],
      "cta": {
        "text": "RESERVATIONS",
        "url": "#",
        "style": "button"
      },
      "layout": "left-logo",
      "isSticky": ${userPrefs.isSticky},
      "hasBlur": ${userPrefs.hasBlur}
    }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
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
        required: ["sector", "style", "colors", "logo", "navigation", "layout", "isSticky", "hasBlur"]
      }
    }
  });

  return JSON.parse(response.text.trim());
};
