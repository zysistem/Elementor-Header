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
    contents: `Sen bir High-End Web Designer ve Elementor Pro uzmanısın. ElementsKit ve modern UI trendlerinden (SaaS, Luxury, Minimalist) ilham alarak 4 FARKLI header tasarımı yap.

    PARAMETRELER:
    - Sektör: ${sector}
    - Kullanıcı İsteği: ${description}
    - Stil: ${userPrefs.style}
    - Teknik: ${userPrefs.isSticky ? 'Sticky' : 'Static'}, ${userPrefs.hasBlur ? 'Blur Aktif' : 'Blur Kapalı'}

    TASARIM YAKLAŞIMLARI:
    1. "The Minimalist": Çok ince fontlar, geniş harf boşlukları (letter-spacing), tamamen şeffaf arka plan, logo solda.
    2. "The Floating Pill": Ekranın üstünden kopuk, kapsül şeklinde, ince borderlı, blur efektli.
    3. "The Centered Identity": Logo tam ortada, menü elemanları sağda ve solda dengeli (Split menu), premium hissi.
    4. "The Action Oriented": Sağ tarafta vurgulu bir CTA butonu, sol tarafta sosyal ikonlar veya kısa iletişim bilgisi barındıran ince bir üst bar (double-row).

    KURALLAR:
    - Tipografi: Kaba fontlardan kaçın. 'Inter', 'Outfit' veya 'Plus Jakarta Sans' kullan. Ağırlıklar 400-600 arası olsun.
    - Renkler: Sektörle uyumlu modern paletler seç.
    - İçerik: Menü öğeleri ve CTA metni '${sector}' sektörüyle doğrudan alakalı olsun.
    - Blur: Eğer blur isteniyorsa, ana konteynır için 'backdrop-filter: blur(10px)' kullanılacağını varsay.`,
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