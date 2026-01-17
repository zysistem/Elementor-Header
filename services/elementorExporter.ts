import { HeaderDesign, ElementorJSON } from "../types";

export const convertToElementorJSON = (design: HeaderDesign): string => {
  const containerId = Math.random().toString(36).substr(2, 9);
  
  // Arka plan rengini blur varsa yarı saydam yap
  let bgColor = design.colors.background;
  if (design.hasBlur && !bgColor.includes('rgba') && bgColor.startsWith('#')) {
    bgColor = bgColor + 'CC'; // %80 opacity ekle
  }

  const cssCode = `
/* ELEMENTOR AI FORGE - STICKY & BLUR ENGINE */
selector {
    transition: background 0.3s ease, padding 0.3s ease, box-shadow 0.3s ease !important;
    ${design.hasBlur ? 'backdrop-filter: blur(20px) saturate(180%) !important; -webkit-backdrop-filter: blur(20px) saturate(180%) !important;' : ''}
    border-bottom: 1px solid rgba(255,255,255,0.08) !important;
}

/* Sticky Durumunda Tetiklenen Efektler */
selector.elementor-sticky--effects {
    background-color: ${design.colors.background} !important;
    padding-top: 10px !important;
    padding-bottom: 10px !important;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
    border-bottom-color: ${design.colors.primary}33 !important;
}

/* Navigasyon Linkleri */
selector .elementor-nav-menu--main .elementor-item {
    color: ${design.colors.text} !important;
    font-weight: 700 !important;
    letter-spacing: 0.1em !important;
    text-transform: uppercase !important;
    transition: all 0.3s ease !important;
}

selector .elementor-nav-menu--main .elementor-item:hover {
    color: ${design.colors.primary} !important;
    transform: translateY(-1px);
}

/* Buton Mekanikleri */
selector .elementor-button {
    background-color: ${design.colors.primary} !important;
    border-radius: 50px !important;
    font-weight: 800 !important;
    box-shadow: 0 8px 20px ${design.colors.primary}33 !important;
}

selector .elementor-button:hover {
    box-shadow: 0 12px 30px ${design.colors.primary}55 !important;
    transform: scale(1.05) !important;
}
  `.replace(/\s+/g, ' ').trim();

  const elementorTemplate: ElementorJSON = {
    version: "0.4",
    title: `AI Header - ${design.sector}`,
    type: "header",
    page_settings: {
      sticky: design.isSticky ? "top" : "",
      sticky_on: ["desktop", "tablet", "mobile"],
      sticky_effects_offset: 40,
      custom_css: cssCode
    },
    content: [
      {
        id: containerId,
        elType: "container",
        settings: {
          content_width: "full",
          flex_direction: "row",
          justify_content: "space-between",
          align_items: "center",
          background_background: "classic",
          background_color: bgColor,
          padding: { unit: "px", top: "20", right: "50", bottom: "20", left: "50", isLinked: false },
          _custom_css: cssCode
        },
        elements: [
          {
            id: Math.random().toString(36).substr(2, 9),
            elType: "widget",
            widgetType: design.logo.type === 'text' ? "heading" : "image",
            settings: design.logo.type === 'text' ? {
              title: design.logo.content,
              title_color: design.colors.primary,
              typography_typography: "custom",
              typography_font_weight: "900"
            } : {
              image: { url: design.logo.content },
              width: { unit: "px", size: 180 }
            }
          },
          {
            id: Math.random().toString(36).substr(2, 9),
            elType: "widget",
            widgetType: "nav-menu",
            settings: {
              layout: "horizontal",
              align: "center",
              toggle_color: design.colors.primary
            }
          },
          {
            id: Math.random().toString(36).substr(2, 9),
            elType: "widget",
            widgetType: "button",
            settings: {
              text: design.cta?.text || "GİRİŞ",
              background_color: design.colors.primary
            }
          }
        ]
      }
    ]
  };

  return JSON.stringify(elementorTemplate, null, 2);
};