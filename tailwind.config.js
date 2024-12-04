const animate = require("tailwindcss-animate");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  safelist: ["dark",
    {
      pattern: /h-screen-minus-\d+/,
      variants: ['sm', 'md', 'lg'], // Optional: Add if using responsive variants
    }
  ],
  prefix: "",

  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      height: {
        "screen-minus-11": "calc(100vh - 7rem)",
        "screen-minus-12": "calc(100vh - 9rem)",
        "screen-minus-10": "calc(100vh - 12rem)",
        "screen-minus-13": "calc(100vh - 14rem)",
        "screen-minus-14": "calc(100vh - 19rem)",
        "screen-minus-15": "calc(100vh - 14rem)",
        "screen-minus-16": "calc(100vh - 16rem)",
        "screen-minus-17": "calc(100vh - 17rem)",
        "screen-minus-18": "calc(100vh - 15rem)",
        "screen-minus-19": "calc(100vh - 20rem)",
        "screen-minus-20": "calc(100vh - 13rem)",
        "screen-minus-21": "calc(100vh - 11rem)",
        "screen-minus-22": "calc(100vh - 10rem)",
        "screen-minus-23": "calc(100vh - 21rem)",
      },

      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "collapsible-down": {
          from: { height: 0 },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-in-out",
        "collapsible-up": "collapsible-up 0.2s ease-in-out",
      },
    },
    boxShadow: {
      "3xl": "0 2px 24px #0000000d",
    },
  },
  plugins: [animate],
  content: [
  './src/**/*.{vue,js,ts,jsx,tsx}', // Scan your components
  './public/**/*.html',             // Include static files, if any
],
};
