import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { THEMES, getThemeCSS } from "@/lib/themes";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  useEffect(() => {
    const roleTheme = user?.role;
    const theme = roleTheme ? THEMES[roleTheme] : THEMES.default;
    const css = getThemeCSS(theme);
    const styleId = "role-theme-style";

    // Remove old style if exists
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create and insert new style with high specificity
    const style = document.createElement("style");
    style.id = styleId;
    // Add !important to ensure theme overrides defaults
    const cssWithImportant = css.replace(/;/g, " !important;");
    style.textContent = cssWithImportant;
    document.head.appendChild(style);

    // Also set on document root for immediate effect
    const root = document.documentElement;
    root.style.setProperty("--primary", theme.primary, "important");
    root.style.setProperty("--accent", theme.accent, "important");
    root.style.setProperty("--primary-foreground", "210 40% 98%", "important");
    root.style.setProperty("--accent-foreground", "0 0% 100%", "important");
    
    // Set data attribute for debugging
    root.setAttribute("data-theme", roleTheme || "default");

    console.log(`✅ Theme applied: ${theme.name} (Primary: ${theme.primary}, Accent: ${theme.accent})`);

    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, [user?.role]);

  return <>{children}</>;
};
