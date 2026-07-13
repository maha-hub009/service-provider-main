export type Theme = {
  primary: string;  // HSL without hsl() wrapper
  accent: string;   // HSL without hsl() wrapper
  buttonPrimary: string;  // Button primary color
  buttonAccent: string;   // Button accent color
  logoColor: string;      // Logo color
  componentBg: string;    // Component background
  name: string;
  description: string;
};

export const THEMES: Record<string, Theme> = {
  admin: {
    primary: "270 100% 30%",     // Deep Purple
    accent: "270 80% 25%",       // Darker Deep Purple
    buttonPrimary: "270 100% 35%", // Slightly lighter for buttons
    buttonAccent: "270 90% 20%",   // Darker for accents
    logoColor: "270 100% 25%",     // Darker for logo
    componentBg: "270 20% 95%",    // Very light purple background
    name: "Admin",
    description: "Professional Deep Purple Theme",
  },
  vendor: {
    primary: "270 100% 50%",     // Medium Purple
    accent: "270 80% 40%",       // Muted Medium Purple
    buttonPrimary: "270 100% 55%", // Slightly lighter for buttons
    buttonAccent: "270 90% 35%",   // Darker for accents
    logoColor: "270 100% 45%",     // Slightly darker for logo
    componentBg: "270 30% 92%",    // Light medium purple background
    name: "Vendor",
    description: "Professional Medium Purple Theme",
  },
  customer: {
    primary: "270 100% 70%",     // Light Purple
    accent: "270 80% 60%",       // Muted Light Purple
    buttonPrimary: "270 100% 75%", // Slightly lighter for buttons
    buttonAccent: "270 90% 50%",   // Darker for accents
    logoColor: "270 100% 65%",     // Slightly darker for logo
    componentBg: "270 40% 88%",    // Light purple background
    name: "Customer",
    description: "Professional Light Purple Theme",
  },
  default: {
    primary: "270 100% 30%",     // Default to Deep Purple
    accent: "270 80% 25%",       // Default accent
    buttonPrimary: "270 100% 35%", // Slightly lighter for buttons
    buttonAccent: "270 90% 20%",   // Darker for accents
    logoColor: "270 100% 25%",     // Darker for logo
    componentBg: "270 20% 95%",    // Very light purple background
    name: "Default",
    description: "Professional Deep Purple Theme",
  },
};

export function getThemeCSS(theme: Theme): string {
  return `
    :root {
      --primary: ${theme.primary};
      --accent: ${theme.accent};
      --button-primary: ${theme.buttonPrimary};
      --button-accent: ${theme.buttonAccent};
      --logo-color: ${theme.logoColor};
      --component-bg: ${theme.componentBg};
      --primary-foreground: 210 40% 98%;
      --accent-foreground: 0 0% 100%;
      --gradient-primary: linear-gradient(135deg, hsl(${theme.primary}) 0%, hsl(${theme.accent}) 100%);
      --gradient-accent: linear-gradient(135deg, hsl(${theme.primary}) 0%, hsl(${theme.accent}) 100%);
      --gradient-hero: linear-gradient(135deg, hsl(${theme.primary} / 0.1) 0%, hsl(${theme.accent} / 0.05) 100%);
      --gradient-card: linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(210 40% 98%) 100%);
      --gradient-service-icon: linear-gradient(135deg, hsl(${theme.primary}) 0%, hsl(${theme.accent}) 100%);
    }
    :root.dark {
      --primary: ${theme.primary};
      --accent: ${theme.accent};
      --button-primary: ${theme.buttonPrimary};
      --button-accent: ${theme.buttonAccent};
      --logo-color: ${theme.logoColor};
      --component-bg: ${theme.componentBg};
      --primary-foreground: 210 40% 98%;
      --accent-foreground: 0 0% 100%;
      --gradient-primary: linear-gradient(135deg, hsl(${theme.primary}) 0%, hsl(${theme.accent}) 100%);
      --gradient-accent: linear-gradient(135deg, hsl(${theme.primary}) 0%, hsl(${theme.accent}) 100%);
      --gradient-hero: linear-gradient(135deg, hsl(${theme.primary} / 0.1) 0%, hsl(${theme.accent} / 0.05) 100%);
      --gradient-card: linear-gradient(180deg, hsl(222 47% 8%) 0%, hsl(222 47% 6%) 100%);
      --gradient-service-icon: linear-gradient(135deg, hsl(${theme.primary}) 0%, hsl(${theme.accent}) 100%);
    }
    html {
      --primary: ${theme.primary};
      --accent: ${theme.accent};
      --button-primary: ${theme.buttonPrimary};
      --button-accent: ${theme.buttonAccent};
      --logo-color: ${theme.logoColor};
      --component-bg: ${theme.componentBg};
      --primary-foreground: 210 40% 98%;
      --accent-foreground: 0 0% 100%;
      --gradient-primary: linear-gradient(135deg, hsl(${theme.primary}) 0%, hsl(${theme.accent}) 100%);
      --gradient-accent: linear-gradient(135deg, hsl(${theme.primary}) 0%, hsl(${theme.accent}) 100%);
      --gradient-hero: linear-gradient(135deg, hsl(${theme.primary} / 0.1) 0%, hsl(${theme.accent} / 0.05) 100%);
      --gradient-card: linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(210 40% 98%) 100%);
      --gradient-service-icon: linear-gradient(135deg, hsl(${theme.primary}) 0%, hsl(${theme.accent}) 100%);
    }
  `;
}
