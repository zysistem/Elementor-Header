import { HeaderDesign, ElementorJSON } from "../types";

export const convertToElementorJSON = (design: HeaderDesign): string => {
  const containerId = Math.random().toString(36).substr(2, 9);
  
  let bgColor = design.colors.background;
  if (design.hasBlur) {
    if (bgColor.startsWith('#')) {
      const r = parseInt(bgColor.slice(1, 3), 16);
      const g = parseInt(bgColor.slice(3, 5), 16);
      const b = parseInt(bgColor.slice(5, 7), 16);
      bgColor = `rgba(${r}, ${g}, ${b}, 0.75)`;
    }
  }

  const cssCode = `
/* HEADER FORGE AI - ELEMENTOR PRO CSS INJECTION */
selector {
    background-color: ${bgColor} !important;
    ${design.hasBlur ? `
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
    ` : ''}
    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
    border-bottom: 1px solid rgba(255,255,255,0.08) !important;
}

${design.layout === 'floating-pill' ? `
selector {
    margin: 15px auto !important;
    border-radius: 50px !important;
    width: 90% !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
}
` : ''}

selector.elementor-sticky--effects {
    background-color: ${design.colors.background} !important;
    padding-top: 8px !important;
    padding-bottom: 8px !important;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
}

selector .elementor-nav-menu--main .elementor-item {
    font-family: '${design.fontFamily}', sans-serif !important;
    color: ${design.colors.text} !important;
    font-weight: 500 !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    font-size: 13px !important;
}

selector .elementor-nav-menu--main .elementor-item:hover {
    color: ${design.colors.primary} !important;
    opacity: 0.7 !important;
}

selector .elementor-button {
    background-color: ${design.colors.primary} !important;
    font-family: '${design.fontFamily}', sans-serif !important;
    border-radius: 8px !important;
    font-weight: 600 !important;
    letter-spacing: 0.05em !important;
    padding: 12px 28px !important;
}
  `.replace(/\s+/g, ' ').trim();

  const elementorTemplate: ElementorJSON = {
    version: "0.4",
    title: `AI Header - ${design.sector}`,
    type: "header",
    page_settings: {
      sticky: design.isSticky ? "top" : "",
      sticky_on: ["desktop", "tablet", "mobile"],
      sticky_effects_offset: 60,
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
          padding: { unit: "px", top: "15", right: "60", bottom: "15", left: "60", isLinked: false },
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
              typography_font_weight: "700"
            } : {
              image: { url: design.logo.content },
              width: { unit: "px", size: 160 }
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