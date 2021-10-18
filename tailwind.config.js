module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#111827",
        secondary: "#3A404D",
        cta: "#31257A",
        ctaLight: "#8977E5",
      },
      borderWidth: {
        1: "1px",
      },
    },
  },
};
