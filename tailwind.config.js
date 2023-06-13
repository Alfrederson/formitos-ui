/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [{
        mytheme: {
          "primary": "#aca2f2",
          "secondary": "#90a1ed", 
          "accent": "#8ca2ea",
          "neutral": "#221c31",
          "base-100": "#e5e1ea",
          "info": "#6e85dd",
          "success": "#209265",
          "warning": "#a45e0e",
          "error": "#eb8875",
        },
      },
    ],
  },
}

