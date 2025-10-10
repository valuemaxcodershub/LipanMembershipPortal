import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      fontFamily: {
        vibes: ['"Great Vibes"', "cursive"],
        "dancing-script": ['"Dancing Script"', "cursive"],
        poppins: ['"Poppins"', "sans-serif"],
      },
    },
  },
  plugins: [flowbite.plugin()],
};
