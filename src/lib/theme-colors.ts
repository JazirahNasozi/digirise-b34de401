// Color theme definitions used across Builder, Preview, and PublicSite
export interface ColorTheme {
  value: string;
  label: string;
  colors: [string, string];
  // HSL values for CSS variables
  primary: string;
  primaryForeground: string;
  accent: string;
  heroGradient: string;
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    value: "gold",
    label: "Gold & Amber",
    colors: ["#D4A017", "#B8860B"],
    primary: "43 96% 56%",
    primaryForeground: "220 20% 10%",
    accent: "38 90% 50%",
    heroGradient: "linear-gradient(135deg, hsl(43, 96%, 56%), hsl(38, 90%, 50%), hsl(30, 85%, 45%))",
  },
  {
    value: "ocean",
    label: "Ocean Blue",
    colors: ["#0077B6", "#023E8A"],
    primary: "200 100% 36%",
    primaryForeground: "0 0% 100%",
    accent: "213 96% 27%",
    heroGradient: "linear-gradient(135deg, hsl(200, 100%, 36%), hsl(213, 96%, 27%))",
  },
  {
    value: "forest",
    label: "Forest Green",
    colors: ["#2D6A4F", "#1B4332"],
    primary: "153 41% 30%",
    primaryForeground: "0 0% 100%",
    accent: "153 44% 18%",
    heroGradient: "linear-gradient(135deg, hsl(153, 41%, 30%), hsl(153, 44%, 18%))",
  },
  {
    value: "sunset",
    label: "Sunset Orange",
    colors: ["#E76F51", "#F4A261"],
    primary: "11 74% 61%",
    primaryForeground: "0 0% 100%",
    accent: "30 87% 67%",
    heroGradient: "linear-gradient(135deg, hsl(11, 74%, 61%), hsl(30, 87%, 67%))",
  },
  {
    value: "royal",
    label: "Royal Purple",
    colors: ["#7B2CBF", "#5A189A"],
    primary: "275 63% 46%",
    primaryForeground: "0 0% 100%",
    accent: "275 75% 35%",
    heroGradient: "linear-gradient(135deg, hsl(275, 63%, 46%), hsl(275, 75%, 35%))",
  },
  {
    value: "minimal",
    label: "Minimal Gray",
    colors: ["#333333", "#666666"],
    primary: "0 0% 20%",
    primaryForeground: "0 0% 100%",
    accent: "0 0% 40%",
    heroGradient: "linear-gradient(135deg, hsl(0, 0%, 20%), hsl(0, 0%, 30%))",
  },
];

export const getTheme = (value: string): ColorTheme =>
  COLOR_THEMES.find((t) => t.value === value) || COLOR_THEMES[0];
