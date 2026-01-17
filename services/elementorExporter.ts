import { HeaderDesign, ElementorJSON } from "../types";

export const convertToElementorJSON = (design: HeaderDesign): string => {
  const containerId = Math.random().toString(36).substr(2, 9);
  
  // Elementor specific high-priority CSS logic
  const cssCode = `
/* Elementor AI Header Auto-Generated CSS */
selector {
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1) !important;
    ${design.hasBlur ? 'backdrop-filter: blur(25px) saturate(200%) !important; -webkit-backdrop-filter: blur(25px) saturate(200%) !important;' : ''}
    z-index: 100 !important;
}

selector.elementor-sticky--effects {
    background-color: ${design.colors.background} !important;
    padding-top: 10px !important;
    padding-bottom: 10px !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2) !important;
}

/* Nav Menu Styling */
selector .elementor-nav-menu--main .elementor-item {
    color: ${design.colors.text} !important;
    font-weight: 800 !important;
    letter-spacing: 0.12em !important;
    text-transform: uppercase !important;
    font-size: 13px !important;
    transition: color 0.3s ease !important;
}

selector .elementor-nav-menu--main .elementor-item:hover,
selector .elementor-nav-menu--main .elementor-item.elementor-item-active {
    color: ${design.colors.primary} !important;
}

/* Button Styling */
selector .elementor-button {
    background-color: ${design.colors.primary} !important;
    border-radius: 12px !important;
    padding: 16px 32px !important;
    font-weight: 900 !important;
    letter-spacing: 0.1em !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 8px 25px ${design.colors.primary}33 !important;
}

selector .elementor-button:hover {
    transform: translateY(-3px) !important;
    box-shadow: 0 12px 35px ${design.colors.primary}4D !important;
    filter: brightness(1.1);
}

/* Hamburger Menu Toggle */
selector .elementor-menu-toggle {
    color: ${design.colors.primary} !important;
    background-color: rgba(255, 255, 255, 0.05) !important;
    border-radius: 10px !important;
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
      custom_css: cssCode // GLOBAL SCOPE INJECTION
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
            top: "20",
            right: "60",
            bottom: "20",
            left: "60",
            isLinked: false
          },
          padding_mobile: {
            unit: "px",
            top: "12",
            right: "24",
            bottom: "12",
            left: "24",
            isLinked: false
          },
          _custom_css: cssCode // CONTAINER SPECIFIC INJECTION
        },
        elements: [
          // Logo Widget
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
              image: { url: design.logo.content || "https://via.placeholder.com/180x50" },
              width: { unit: "px", size: 180 },
              width_mobile: { unit: "px", size: 120 },
              _custom_css: cssCode
            }
          },
          // Menu Widget
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
          // CTA Button
          {
            id: Math.random().toString(36).substr(2, 9),
            elType: "widget",
            widgetType: "button",
            settings: {
              text: design.cta?.text || "EXPLORE",
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