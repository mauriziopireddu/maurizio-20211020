module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        black: "#111827",
        secondary: "#3A404D",
        cta: "#31257A",
      },
      borderWidth: {
        1: "1px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
