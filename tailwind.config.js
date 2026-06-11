/** @type {import('tailwindcss').Config} */
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: v("bg"),
        panel: v("panel"),
        card: v("card"),
        cardhover: v("cardhover"),
        border: v("border"),
        borderlight: v("borderlight"),
        ink: v("ink"),
        muted: v("muted"),
        faint: v("faint"),
        brand: {
          DEFAULT: v("brand"),
          soft: v("brand-soft"),
          dim: v("brand-dim"),
        },
        teal: v("teal"),
        emerald: v("emerald"),
        amber: v("amber"),
        rose: v("rose"),
        sky: v("sky"),
        violet: v("violet"),
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        glow: "0 0 0 1px rgba(99,102,241,0.35), 0 8px 30px -8px rgba(99,102,241,0.4)",
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.1rem",
      },
      keyframes: {
        fadein: { "0%": { opacity: 0, transform: "translateY(4px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        scalein: { "0%": { opacity: 0, transform: "scale(0.97)" }, "100%": { opacity: 1, transform: "scale(1)" } },
        pulsedot: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } },
      },
      animation: {
        fadein: "fadein 0.25s ease-out",
        scalein: "scalein 0.18s ease-out",
        pulsedot: "pulsedot 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
