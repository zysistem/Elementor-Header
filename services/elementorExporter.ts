
import { HeaderDesign, ElementorJSON } from "../types";

/**
 * Elementor Flex Container tabanlı modern JSON yapısı.
 * Legacy Section/Column yapısı yerine yeni Container yapısını kullanır.
 */
export const convertToElementorJSON = (design: HeaderDesign): string => {
  const containerId = Math.random().toString(36).substr(2, 9);
  
  // Custom CSS for advanced effects like glassmorphism and sticky transitions
  const customCss = `
selector {
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    ${design.hasBlur ? `backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%);` : ''}
}

selector.elementor-sticky--effects {
    background-color: ${design.colors.background} !important;
    padding-top: 10px !important;
    padding-bottom: 10px !important;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

/* Nav Menu Styling */
selector .elementor-nav-menu a {
    transition: color 0.3s ease;
}

/* Button Hover */
selector .elementor-button {
    transition: all 0.3s ease;
}
  `.trim();

  const elementorTemplate: ElementorJSON = {
    version: "0.4",
    title: `${design.sector} - Modern Container Header`,
    type: "header",
    page_settings: {
      sticky: design.isSticky ? "top" : "",
      sticky_on: ["desktop", "tablet", "mobile"],
      sticky_effects_offset: 50,
      custom_css: customCss
    },
    content: [
      {
        id: containerId,
        elType: "container",
        isInner: false,
        settings: {
          content_width: "full",
          width: { unit: "%", size: 100 },
          min_height: { unit: "px", size: 85 },
          flex_direction: "row",
          justify_content: "space-between",
          align_items: "center",
          background_background: "classic",
          background_color: design.colors.background,
          padding: {
            unit: "px",
            top: "15",
            right: "40",
            bottom: "15",
            left: "40",
            isLinked: false
          },
          // Container settings for Flex
          container_type: "flex",
          _custom_css: customCss
        },
        elements: [
          // Logo Container
          {
            id: Math.random().toString(36).substr(2, 9),
            elType: "container",
            settings: {
              width: { unit: "%", size: 20 },
              flex_direction: "row",
              justify_content: "flex-start"
            },
            elements: [
              {
                id: Math.random().toString(36).substr(2, 9),
                elType: "widget",
                widgetType: design.logo.type === 'text' ? "heading" : "image",
                settings: design.logo.type === 'text' ? {
                  title: design.logo.content,
                  size: "small",
                  header_size: "h3",
                  title_color: design.colors.primary,
                  typography_typography: "custom",
                  typography_font_weight: "800",
                  typography_font_family: "Inter"
                } : {
                  image: {
                    url: design.logo.content || "https://via.placeholder.com/200x60?text=LOGO",
                  },
                  image_size: "full",
                  width: { unit: "px", size: 180 }
                }
              }
            ]
          },
          // Navigation Container
          {
            id: Math.random().toString(36).substr(2, 9),
            elType: "container",
            settings: {
              width: { unit: "%", size: 50 },
              flex_direction: "row",
              justify_content: "center"
            },
            elements: [
              {
                id: Math.random().toString(36).substr(2, 9),
                elType: "widget",
                widgetType: "nav-menu",
                settings: {
                  menu: "main-menu",
                  layout: "horizontal",
                  align: "center",
                  color_menu_item: design.colors.text,
                  color_menu_item_hover: design.colors.primary,
                  typography_typography: "custom",
                  typography_font_size: { unit: "px", size: "14" },
                  typography_font_weight: "700",
                  typography_font_family: "Inter",
                  typography_text_transform: "uppercase",
                  pointer: "none"
                }
              }
            ]
          },
          // CTA & Language Container
          {
            id: Math.random().toString(36).substr(2, 9),
            elType: "container",
            settings: {
              width: { unit: "%", size: 25 },
              flex_direction: "row",
              justify_content: "flex-end",
              align_items: "center",
              gap: { unit: "px", size: 20 }
            },
            elements: [
              design.cta ? {
                id: Math.random().toString(36).substr(2, 9),
                elType: "widget",
                widgetType: "button",
                settings: {
                  text: design.cta.text,
                  link: { url: design.cta.url },
                  button_text_color: "#ffffff",
                  background_color: design.colors.primary,
                  align: "right",
                  border_radius: { unit: "px", top: "10", right: "10", bottom: "10", left: "10" },
                  typography_typography: "custom",
                  typography_font_weight: "700",
                  typography_font_family: "Inter",
                  padding: { unit: "px", top: "16", right: "28", bottom: "16", left: "28" }
                }
              } : null
            ].filter(Boolean) as any[]
          }
        ]
      }
    ]
  };

  return JSON.stringify(elementorTemplate, null, 2);
};
