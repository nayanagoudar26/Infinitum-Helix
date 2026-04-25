module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        shell: "#07131f",
        panel: "#0f2233",
        mint: "#6ee7b7",
        coral: "#f97360",
        mist: "#c9d6df",
        sun: "#facc15"
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "Segoe UI", "Arial", "sans-serif"],
        display: ["Space Grotesk", "Manrope", "Inter", "Segoe UI", "Arial", "sans-serif"]
      },
      boxShadow: {
        glow: "0 20px 80px rgba(18, 184, 134, 0.18)"
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(201,214,223,0.14) 1px, transparent 0)"
      }
    }
  },
  plugins: []
}
