export interface NavItem {
  label: string;
  url: string;
}

export interface HeaderDesign {
  sector: string;
  style: string;
  fontFamily: string;
  mechanicSummary: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
  logo: {
    type: 'text' | 'image';
    content: string;
  };
  navigation: NavItem[];
  cta?: {
    text: string;
    url: string;
    style: 'button' | 'outline' | 'link';
  };
  layout: 'left-logo' | 'center-logo' | 'split-menu' | 'floating-pill';
  isSticky: boolean;
  hasBlur: boolean;
}

export interface ElementorJSON {
  content: any[];
  page_settings: Record<string, any>;
  version: string;
  title: string;
  type: string;
}