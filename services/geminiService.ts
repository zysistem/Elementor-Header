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
    contents: `Bir High-End UI/UX Designer ve Elementor Pro uzmanı olarak 4 benzersiz ve ultra-modern header tasarımı yap.
    
    PARAMETRELER:
    - Sektör: ${sector}
    - Kullanıcı Notu: ${description}
    - Stil: ${userPrefs.style}
    - Mekanik: ${userPrefs.mechanic}
    - Teknik: ${userPrefs.isSticky ? 'Sticky' : 'Static'}, ${userPrefs.hasBlur ? 'Glassmorphism' : 'Flat'}

    TASARIM ÇEŞİTLİLİĞİ (Her varyasyon farklı bir yaklaşım sergilemeli):
    1. Varyasyon 1 (The Maverick): Modern, geniş paddingli, asimetrik detaylar.
    2. Varyasyon 2 (Floating Pill): Kenarlardan kopuk, tam yuvarlatılmış (rounded-full), havada süzülen yapı.
    3. Varyasyon 3 (The Split): Logo merkezde, menü elemanları logoyu çevreleyen iki ayrı konteynerde.
    4. Varyasyon 4 (Futuristic Glass): Ultra-blur, ince border glow, yüksek teknoloji hissi.

    ÖNEMLİ: Font seçimi yaparken Google Fonts'tan (Outfit, Plus Jakarta Sans, Inter) birini seç. 
    JSON çıktısında hangi renklerin ve fontun neden seçildiğini özetleyen 'mechanicSummary' alanını doldur.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            sector: { type: Type.STRING },
            style: { type: Type.STRING },
            fontFamily: { type: Type.STRING, description: "Örn: 'Outfit', 'Plus Jakarta Sans', 'Inter'" },
            mechanicSummary: { type: Type.STRING, description: "Bu tasarımın mekanik ve renk detaylarının özeti." },
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