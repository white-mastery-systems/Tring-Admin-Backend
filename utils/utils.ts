import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Updater } from "@tanstack/vue-table";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function valueUpdater<T extends Updater<any>>(
  updaterOrValue: T,
  ref: Ref,
) {
  ref.value =
    typeof updaterOrValue === "function"
      ? updaterOrValue(ref.value)
      : updaterOrValue;
}

export function hexToHSL(hex) {
  // Remove the hash if present
  hex = hex.replace(/^#/, "");

  // Convert hex to RGB
  let r = parseInt(hex.slice(0, 2), 16) / 255;
  let g = parseInt(hex.slice(2, 4), 16) / 255;
  let b = parseInt(hex.slice(4, 6), 16) / 255;

  // Find the minimum and maximum values of RGB
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);

  // Calculate lightness
  let l = (max + min) / 2;

  let h, s;

  if (max === min) {
    // Achromatic
    h = s = 0;
  } else {
    // Calculate saturation
    s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);

    // Calculate hue
    switch (max) {
      case r:
        h = (g - b) / (max - min) + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / (max - min) + 2;
        break;
      case b:
        h = (r - g) / (max - min) + 4;
        break;
    }
    h /= 6;
  }

  // Convert hue to degrees, and saturation and lightness to percentages
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  // Return the HSL values as a string
  return `${h} ${s}% ${l}%`;
}
export const convertToHsl = (color: string) => {
  // If it's already an HSL(A) format, return it as is
  if (color.includes("hsl") || color.includes("%")) {
    return color;
  }

  // If it's a HEX value, convert it to HSL
  let r = 0, g = 0, b = 0;
  if (color.startsWith("#") && (color.length === 7 || color.length === 4)) {
    if (color.length === 7) { // #RRGGBB
      r = parseInt(color.substring(1, 3), 16);
      g = parseInt(color.substring(3, 5), 16);
      b = parseInt(color.substring(5, 7), 16);
    } else if (color.length === 4) { // #RGB (short-hand)
      r = parseInt(color[1] + color[1], 16);
      g = parseInt(color[2] + color[2], 16);
      b = parseInt(color[3] + color[3], 16);
    }
  } else {
    return "Invalid color format"; // Return error if it's not HEX or HSL
  }

  // Convert RGB to HSL
  r /= 255, g /= 255, b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

export function hslToHex(hslString) {
  // Parse the HSL string
  let [h, s, l] = hslString.split(" ").map((val) => parseFloat(val));

  // Remove '%' from saturation and lightness if present
  s = s.toString().replace("%", "") / 100;
  l = l.toString().replace("%", "") / 100;

  const hueToRgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = hueToRgb(p, q, (h / 360 + 1 / 3) % 1);
  const g = hueToRgb(p, q, h / 360);
  const b = hueToRgb(p, q, (h / 360 - 1 / 3 + 1) % 1);

  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
