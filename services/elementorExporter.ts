import { HeaderDesign, ElementorJSON } from "../types";

export const convertToElementorJSON = (design: HeaderDesign): string => {
  const containerId = Math.random().toString(36).substr(2, 9);
  
  // Blur varsa arka planı kesinlikle yarı saydam yap (HEX -> RGBA conversion or adding alpha)
  let bgColor = design.colors.background;
  if (design.hasBlur) {
    if (bgColor.startsWith('#')) {
      // #000000 -> rgba(0,0,0,0.7)
      const r = parseInt(bgColor.slice(1, 3), 16);
      const g = parseInt(bgColor.slice(3, 5), 16);
      const b = parseInt(bgColor.slice(5, 7), 16);
      bgColor = `rgba(${r}, ${g}, ${b}, 0.7)`;
    }
  }

  const cssCode = `
/* ELEMENTOR AI FORGE - BLUR & STICKY ENGINE */
/* Blur Efektini Zorla */
selector {
    background-color: ${bgColor} !important;
    ${design.hasBlur ? `
    backdrop-filter: blur(25px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(25px) saturate(180%) !important;
    ` : ''}
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
    border-bottom: 1px solid rgba(255,255,255,0.05) !important;
}

/* Floating Mekaniği */
${design.layout === 'floating-pill' ? `
selector {
    margin: 20px 40px !important;
    border-radius: 100px !important;
    width: calc(100% - 80px) !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
}
` : ''}

/* Sticky Durumunda Efektler */
selector.elementor-sticky--effects {
    background-color: ${design.colors.background} !important;
    padding-top: 10px !important;
    padding-bottom: 10px !important;
    box-shadow: 0 15px 40px rgba(0,0,0,0.2) !important;
    border-bottom-color: ${design.colors.primary}40 !important;
}

/* Tipografi ve Renkler */
selector .elementor-nav-menu--main .elementor-item {
    font-family: '${design.fontFamily}', sans-serif !important;
    color: ${design.colors.text} !important;
    font-weight: 700 !important;
    letter-spacing: 0.05em !important;
    text-transform: uppercase !important;
}

selector .elementor-nav-menu--main .elementor-item:hover {
    color: ${design.colors.primary} !important;
}

/* Buton Tasarımı */
selector .elementor-button {
    background-color: ${design.colors.primary} !important;
    font-family: '${design.fontFamily}', sans-serif !important;
    border-radius: 12px !important;
    font-weight: 800 !important;
    transition: all 0.3s ease !important;
}

selector .elementor-button:hover {
    box-shadow: 0 10px 30px ${design.colors.primary}40 !important;
    transform: translateY(-2px) !important;
}
  `.replace(/\s+/g, ' ').trim();

  const elementorTemplate: ElementorJSON = {
    version: "0.4",
    title: `AI Header - ${design.sector}`,
    type: "header",
    page_settings: {
      sticky: design.isSticky ? "top" : "",
      sticky_on: ["desktop", "tablet", "mobile"],
      sticky_effects_offset: 50,
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
          padding: { unit: "px", top: "20", right: "60", bottom: "20", left: "60", isLinked: false },
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
              typography_font_family: design.fontFamily,
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