import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* Base backgrounds */
        "bg-app": "hsl(var(--bg-app))",
        "bg-card": "hsl(var(--bg-card))",
        "bg-muted": "hsl(var(--bg-muted))",
        "bg-subtle": "hsl(var(--bg-subtle))",
        
        /* Text colors */
        "text-primary": "hsl(var(--text-primary))",
        "text-secondary": "hsl(var(--text-secondary))",
        "text-muted": "hsl(var(--text-muted))",
        
        /* Brand colors */
        "brand-700": "hsl(var(--brand-700))",
        "brand-600": "hsl(var(--brand-600))",
        "brand-100": "hsl(var(--brand-100))",
        "brand-text": "hsl(var(--brand-text))",
        
        /* Accent colors */
        "accent-success": "hsl(var(--accent-success))",
        "accent-warning": "hsl(var(--accent-warning))",
        "accent-danger": "hsl(var(--accent-danger))",
        "accent-info": "hsl(var(--accent-info))",
        
        /* Border colors */
        "border-light": "hsl(var(--border-light))",
        "border-muted": "hsl(var(--border-muted))",
        "border-subtle": "hsl(var(--border-subtle))",
        
        /* Legacy compatibility - mapped to new tokens */
        border: "hsl(var(--border-light))",
        input: "hsl(var(--border-light))",
        ring: "hsl(var(--brand-600))",
        background: "hsl(var(--bg-app))",
        foreground: "hsl(var(--text-primary))",
        primary: {
          DEFAULT: "hsl(var(--brand-600))",
          foreground: "hsl(var(--bg-card))",
        },
        secondary: {
          DEFAULT: "hsl(var(--bg-subtle))",
          foreground: "hsl(var(--text-primary))",
        },
        destructive: {
          DEFAULT: "hsl(var(--accent-danger))",
          foreground: "hsl(var(--bg-card))",
        },
        muted: {
          DEFAULT: "hsl(var(--bg-muted))",
          foreground: "hsl(var(--text-secondary))",
        },
        popover: {
          DEFAULT: "hsl(var(--bg-card))",
          foreground: "hsl(var(--text-primary))",
        },
        card: {
          DEFAULT: "hsl(var(--bg-card))",
          foreground: "hsl(var(--text-primary))",
        },
        success: {
          DEFAULT: "hsl(var(--accent-success))",
          foreground: "hsl(var(--bg-card))",
        },
        warning: {
          DEFAULT: "hsl(var(--accent-warning))",
          foreground: "hsl(var(--bg-card))",
        },
        info: {
          DEFAULT: "hsl(var(--accent-info))",
          foreground: "hsl(var(--bg-card))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        button: "var(--radius-button)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        subtle: "var(--shadow-subtle)",
      },
      spacing: {
        'sidebar': 'var(--sidebar-width)',
        'topbar': 'var(--topbar-height)',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
