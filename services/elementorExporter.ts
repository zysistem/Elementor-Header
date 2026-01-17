import { HeaderDesign, ElementorJSON } from "../types";

export const convertToElementorJSON = (design: HeaderDesign): string => {
  const containerId = Math.random().toString(36).substr(2, 9);
  
  // High-priority CSS logic for Elementor
  const cssCode = `
/* ELEMENTOR AI HEADER INJECTION */
selector {
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1) !important;
    ${design.hasBlur ? 'backdrop-filter: blur(25px) saturate(200%) !important; -webkit-backdrop-filter: blur(25px) saturate(200%) !important;' : ''}
    z-index: 100 !important;
}

selector.elementor-sticky--effects {
    background-color: ${design.colors.background} !important;
    padding-top: 10px !important;
    padding-bottom: 10px !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
}

/* Navigation Items */
selector .elementor-nav-menu--main .elementor-item {
    color: ${design.colors.text} !important;
    font-weight: 800 !important;
    letter-spacing: 0.15em !important;
    text-transform: uppercase !important;
    font-size: 13px !important;
    transition: all 0.3s ease !important;
}

selector .elementor-nav-menu--main .elementor-item:hover,
selector .elementor-nav-menu--main .elementor-item.elementor-item-active {
    color: ${design.colors.primary} !important;
    opacity: 0.8 !important;
}

/* Action Button */
selector .elementor-button {
    background-color: ${design.colors.primary} !important;
    border-radius: 14px !important;
    padding: 16px 32px !important;
    font-weight: 900 !important;
    letter-spacing: 0.1em !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 10px 30px ${design.colors.primary}40 !important;
}

selector .elementor-button:hover {
    transform: translateY(-4px) !important;
    box-shadow: 0 15px 45px ${design.colors.primary}60 !important;
    filter: brightness(1.1);
}

/* Mobile Toggle */
selector .elementor-menu-toggle {
    color: ${design.colors.primary} !important;
    background-color: rgba(255, 255, 255, 0.05) !important;
    border-radius: 12px !important;
}
  `.replace(/\s+/g, ' ').trim();

  const elementorTemplate: ElementorJSON = {
    version: "0.4",
    title: `AI Flux Header - ${design.sector}`,
    type: "header",
    page_settings: {
      sticky: design.isSticky ? "top" : "",
      sticky_on: ["desktop", "tablet", "mobile"],
      sticky_effects_offset: 50,
      custom_css: cssCode // Page level CSS
    },
    content: [
      {
        id: containerId,
        elType: "container",
        isInner: false,
        settings: {
          content_width: "full",
          flex_direction: "row",
          flex_direction_mobile: "row",
          justify_content: "space-between",
          align_items: "center",
          background_background: "classic",
          background_color: design.colors.background,
          padding: {
            unit: "px",
            top: "22",
            right: "60",
            bottom: "22",
            left: "60",
            isLinked: false
          },
          padding_mobile: {
            unit: "px",
            top: "14",
            right: "24",
            bottom: "14",
            left: "24",
            isLinked: false
          },
          _custom_css: cssCode // Container level CSS
        },
        elements: [
          // Logo Section
          {
            id: Math.random().toString(36).substr(2, 9),
            elType: "widget",
            widgetType: design.logo.type === 'text' ? "heading" : "image",
            settings: design.logo.type === 'text' ? {
              title: design.logo.content,
              size: "small",
              header_size: "h4",
              title_color: design.colors.primary,
              typography_typography: "custom",
              typography_font_weight: "900",
              typography_font_family: "Inter",
              _custom_css: cssCode
            } : {
              image: { url: design.logo.content || "https://via.placeholder.com/200x60" },
              width: { unit: "px", size: 190 },
              width_mobile: { unit: "px", size: 125 },
              _custom_css: cssCode
            }
          },
          // Navigation Menu Section
          {
            id: Math.random().toString(36).substr(2, 9),
            elType: "widget",
            widgetType: "nav-menu",
            settings: {
              menu: "main-menu",
              layout: "horizontal",
              align: "center",
              mobile_menu_layout: "dropdown",
              full_width: "yes",
              toggle_align: "right",
              toggle_color: design.colors.primary,
              _custom_css: cssCode
            }
          },
          // Call To Action Section
          {
            id: Math.random().toString(36).substr(2, 9),
            elType: "widget",
            widgetType: "button",
            settings: {
              text: design.cta?.text || "EXPLORE NOW",
              link: { url: "#" },
              background_color: design.colors.primary,
              button_text_color: "#ffffff",
              typography_typography: "custom",
              typography_font_weight: "900",
              typography_font_family: "Inter",
              _display_mobile: "none",
              _custom_css: cssCode
            }
          }
        ]
      }
    ]
  };

  return JSON.stringify(elementorTemplate, null, 2);
};