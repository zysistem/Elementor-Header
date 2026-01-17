
import { HeaderDesign, ElementorJSON } from "../types";

export const convertToElementorJSON = (design: HeaderDesign): string => {
  const containerId = Math.random().toString(36).substr(2, 9);
  
  // Custom CSS optimized for Elementor injection
  const cssCode = `
/* Global Container Effects */
selector {
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    ${design.hasBlur ? 'backdrop-filter: blur(20px) saturate(180%) !important; -webkit-backdrop-filter: blur(20px) saturate(180%) !important;' : ''}
}

/* Sticky Transitions */
selector.elementor-sticky--effects {
    background-color: ${design.colors.background} !important;
    padding-top: 12px !important;
    padding-bottom: 12px !important;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;
}

/* Nav Menu Modern Styling */
selector .elementor-nav-menu--main .elementor-item {
    color: ${design.colors.text} !important;
    font-weight: 700 !important;
    letter-spacing: 0.1em !important;
    text-transform: uppercase !important;
    transition: color 0.3s ease !important;
}

selector .elementor-nav-menu--main .elementor-item:hover {
    color: ${design.colors.primary} !important;
}

/* CTA Button Interaction */
selector .elementor-button {
    background-color: ${design.colors.primary} !important;
    border-radius: 12px !important;
    padding: 14px 28px !important;
    transition: all 0.3s ease !important;
}

selector .elementor-button:hover {
    background-color: ${design.colors.primary} !important;
    filter: brightness(1.1);
    transform: translateY(-2px);
}
  `.replace(/\s+/g, ' ').trim();

  const elementorTemplate: ElementorJSON = {
    version: "0.4",
    title: `AI Header - ${design.style.toUpperCase()}`,
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
            right: "40",
            bottom: "20",
            left: "40",
            isLinked: false
          },
          padding_mobile: {
            unit: "px",
            top: "12",
            right: "20",
            bottom: "12",
            left: "20",
            isLinked: false
          },
          _custom_css: cssCode
        },
        elements: [
          // Logo Container / Widget
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
              typography_font_family: "Inter"
            } : {
              image: { url: design.logo.content || "https://via.placeholder.com/150x50" },
              width: { unit: "px", size: 160 },
              width_mobile: { unit: "px", size: 110 }
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
              _display_mobile: "block"
            }
          },
          // Button Widget
          {
            id: Math.random().toString(36).substr(2, 9),
            elType: "widget",
            widgetType: "button",
            settings: {
              text: design.cta?.text || "GET STARTED",
              link: { url: "#" },
              background_color: design.colors.primary,
              button_text_color: "#ffffff",
              typography_typography: "custom",
              typography_font_weight: "800",
              typography_font_size: { unit: "px", size: 12 },
              _display_mobile: "none"
            }
          }
        ]
      }
    ]
  };

  return JSON.stringify(elementorTemplate, null, 2);
};
