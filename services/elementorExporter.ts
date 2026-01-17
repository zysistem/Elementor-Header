import { HeaderDesign, ElementorJSON } from "../types";

export const convertToElementorJSON = (design: HeaderDesign): string => {
  const containerId = Math.random().toString(36).substr(2, 9);
  
  let bgColor = design.colors.background;
  if (design.hasBlur) {
    if (bgColor.startsWith('#')) {
      const r = parseInt(bgColor.slice(1, 3), 16);
      const g = parseInt(bgColor.slice(3, 5), 16);
      const b = parseInt(bgColor.slice(5, 7), 16);
      bgColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
    }
  }

  const cssCode = `
/* ZYHEADER AI - ELEMENTS-KIT INSPIRED ENGINE */
selector {
    background-color: ${bgColor} !important;
    ${design.hasBlur ? `
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
    ` : ''}
    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
    border-bottom: 1px solid rgba(0,0,0,0.05) !important;
}

/* ElementsKit Specific Nav Styling */
selector .elementor-nav-menu--main .elementor-item {
    font-family: '${design.fontFamily}', sans-serif !important;
    color: ${design.colors.text} !important;
    font-weight: 500 !important;
    letter-spacing: 0.02em !important;
    font-size: 15px !important;
}

selector .elementor-nav-menu--main .elementor-item:hover {
    color: ${design.colors.primary} !important;
}

/* Button & Action Styling */
selector .elementor-button {
    background-color: ${design.colors.primary} !important;
    font-family: '${design.fontFamily}', sans-serif !important;
    border-radius: 4px !important;
    font-weight: 600 !important;
    padding: 14px 28px !important;
    transition: all 0.3s ease !important;
}

selector .elementor-button:hover {
    box-shadow: 0 8px 20px -4px ${design.colors.primary}66 !important;
    transform: translateY(-1px) !important;
}

/* Layout Variations */
${design.layout === 'floating-pill' ? `
selector {
    margin: 15px 30px !important;
    border-radius: 100px !important;
    width: auto !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
}
` : ''}

selector.elementor-sticky--effects {
    box-shadow: 0px 8px 16px -4px rgba(9, 11, 15, 0.1) !important;
    padding-top: 10px !important;
    padding-bottom: 10px !important;
}
  `.replace(/\s+/g, ' ').trim();

  const elementorTemplate: ElementorJSON = {
    version: "0.4",
    title: `ZyHeader - ${design.sector}`,
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
          justify_content: design.layout === 'center-logo' ? "center" : "space-between",
          align_items: "center",
          background_background: "classic",
          background_color: bgColor,
          padding: { unit: "px", top: "15", right: "40", bottom: "15", left: "40", isLinked: false },
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
              typography_font_weight: "700",
              typography_font_size: { unit: "px", size: 24 }
            } : {
              image: { url: design.logo.content },
              width: { unit: "px", size: 140 }
            }
          },
          {
            id: Math.random().toString(36).substr(2, 9),
            elType: "widget",
            widgetType: "nav-menu",
            settings: {
              layout: "horizontal",
              align: design.layout === 'center-logo' ? "center" : "right",
              toggle_color: design.colors.primary
            }
          },
          {
            id: Math.random().toString(36).substr(2, 9),
            elType: "widget",
            widgetType: "button",
            settings: {
              text: design.cta?.text || "Action",
              background_color: design.colors.primary
            }
          }
        ]
      }
    ]
  };

  return JSON.stringify(elementorTemplate, null, 2);
};