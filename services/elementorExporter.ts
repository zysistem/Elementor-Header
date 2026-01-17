import { HeaderDesign, ElementorJSON } from "../types";

export const convertToElementorJSON = (design: HeaderDesign): string => {
  const generateId = () => Math.random().toString(36).substr(2, 9);
  
  let bgColor = design.colors.background;
  if (design.hasBlur) {
    if (bgColor.startsWith('#')) {
      const r = parseInt(bgColor.slice(1, 3), 16);
      const g = parseInt(bgColor.slice(3, 5), 16);
      const b = parseInt(bgColor.slice(5, 7), 16);
      bgColor = `rgba(${r}, ${g}, ${b}, 0.85)`;
    }
  }

  const cssCode = `
selector {
    background-color: ${design.layout === 'dual-bar' ? 'transparent' : bgColor} !important;
    ${design.hasBlur ? 'backdrop-filter: blur(15px) !important; -webkit-backdrop-filter: blur(15px) !important;' : ''}
    transition: all 0.3s ease-in-out;
}
selector .elementor-item {
    font-family: '${design.fontFamily}', sans-serif !important;
    color: ${design.colors.text} !important;
    font-weight: 500;
}
selector .elementor-button {
    background-color: ${design.colors.primary} !important;
    border-radius: ${design.style === 'minimal' ? '0px' : '8px'} !important;
}
`.replace(/\s+/g, ' ').trim();

  // Content array starts with a Top Bar if layout is dual-bar
  const containers: any[] = [];

  if (design.layout === 'dual-bar') {
    containers.push({
      id: generateId(),
      elType: "container",
      settings: {
        content_width: "full",
        background_background: "classic",
        background_color: design.colors.primary,
        padding: { unit: "px", top: "8", right: "40", bottom: "8", left: "40", isLinked: false },
        flex_direction: "row",
        justify_content: "space-between"
      },
      elements: [
        {
          id: generateId(),
          elType: "widget",
          widgetType: "icon-list",
          settings: {
            icon_list: [
              { text: design.topBar?.phone || "+00 000 000", icon: { value: "fas fa-phone", library: "fa-solid" } },
              { text: design.topBar?.email || "info@example.com", icon: { value: "fas fa-envelope", library: "fa-solid" } }
            ],
            inline: "yes"
          }
        }
      ]
    });
  }

  // Main Navigation Container
  containers.push({
    id: generateId(),
    elType: "container",
    settings: {
      content_width: design.layout === 'floating-pill' ? "boxed" : "full",
      flex_direction: "row",
      justify_content: "space-between",
      align_items: "center",
      background_background: "classic",
      background_color: design.layout === 'dual-bar' ? "#FFFFFF" : bgColor,
      padding: { unit: "px", top: "15", right: "40", bottom: "15", left: "40", isLinked: false },
      _custom_css: cssCode,
      margin: design.layout === 'floating-pill' ? { top: "20", bottom: "20" } : {},
      border_radius: design.layout === 'floating-pill' ? { unit: "px", top: "100", right: "100", bottom: "100", left: "100" } : {}
    },
    elements: [
      {
        id: generateId(),
        elType: "widget",
        widgetType: design.logo.type === 'text' ? "heading" : "image",
        settings: design.logo.type === 'text' ? {
          title: design.logo.content,
          title_color: design.colors.primary,
          typography_typography: "custom",
          typography_font_family: design.fontFamily,
          typography_font_weight: "800",
          typography_font_size: { unit: "px", size: 24 }
        } : {
          image: { url: design.logo.content },
          width: { unit: "px", size: 150 }
        }
      },
      {
        id: generateId(),
        elType: "widget",
        widgetType: "nav-menu",
        settings: {
          layout: "horizontal",
          align: "center",
          pointer: "underline"
        }
      },
      {
        id: generateId(),
        elType: "widget",
        widgetType: "button",
        settings: {
          text: design.cta?.text || "Contact Us",
          button_type: "primary",
          size: "md"
        }
      }
    ]
  });

  const elementorTemplate: ElementorJSON = {
    version: "0.4",
    title: `ZyHeader - ${design.sector} - ${design.layout}`,
    type: "header",
    page_settings: {
      sticky: design.isSticky ? "top" : "",
      sticky_on: ["desktop", "tablet", "mobile"],
      custom_css: cssCode
    },
    content: containers
  };

  return JSON.stringify(elementorTemplate, null, 2);
};