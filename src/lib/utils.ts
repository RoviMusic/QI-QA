import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { iconComponents } from "./constants/Icon";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getIcon(iconName: string) {
  const IconComponent = iconComponents[iconName];
  return IconComponent();
}

// Función para convertir color hex a RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  // Eliminar el # si existe
  hex = hex.replace(/^#/, "");

  // Manejar formato corto (#fff) y largo (#ffffff)
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Función para calcular la luminosidad relativa
const getLuminance = (r: number, g: number, b: number): number => {
  // Normalizar valores RGB
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  // Calcular luminosidad según la fórmula WCAG
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// Función para determinar si se debe usar texto claro u oscuro
export const getTextColorForBackground = (backgroundColor: string): string => {
  // Manejar colores nombrados comunes
  const namedColors: { [key: string]: string } = {
    black: "#000000",
    white: "#ffffff",
    red: "#ff0000",
    blue: "#0000ff",
    green: "#008000",
    yellow: "#ffff00",
    orange: "#ffa500",
    purple: "#800080",
    pink: "#ffc0cb",
    gray: "#808080",
    grey: "#808080",
  };

  let hexColor = backgroundColor.toLowerCase();

  // Convertir color nombrado a hex si es necesario
  if (namedColors[hexColor]) {
    hexColor = namedColors[hexColor];
  }

  // Manejar colores RGB
  if (hexColor.startsWith("rgb")) {
    const match = hexColor.match(/\d+/g);
    if (match && match.length >= 3) {
      const luminance = getLuminance(
        parseInt(match[0]),
        parseInt(match[1]),
        parseInt(match[2])
      );
      return luminance > 0.5 ? "#000000" : "#ffffff";
    }
  }

  // Convertir hex a RGB
  const rgb = hexToRgb(hexColor);
  if (!rgb) {
    return "#000000"; // Por defecto negro si no se puede convertir
  }

  // Calcular luminosidad
  const luminance = getLuminance(rgb.r, rgb.g, rgb.b);

  // Si la luminosidad es mayor a 0.5, usar texto oscuro, sino claro
  return luminance > 0.5 ? "#000000" : "#ffffff";
};

// Tremor focusInput [v0.0.2]

export const focusInput = [
  // base
  "focus:ring-2",
  // ring color
  "focus:ring-blue-200 dark:focus:ring-blue-700/30",
  // border color
  "focus:border-blue-500 dark:focus:border-blue-700",
];

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-blue-500 dark:outline-blue-500",
];

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
  // base
  "ring-2",
  // border color
  "border-red-500 dark:border-red-700",
  // ring color
  "ring-red-200 dark:ring-red-700/30",
];
