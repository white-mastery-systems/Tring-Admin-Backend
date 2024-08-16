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
