/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                space: ['Space Grotesk', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            colors: {
                cyan: {
                    400: '#22d3ee',
                    500: '#06b6d4',
                },
                purple: {
                    500: '#a855f7',
                    600: '#9333ea',
                },
            },
        },
    },
    plugins: [],
}
