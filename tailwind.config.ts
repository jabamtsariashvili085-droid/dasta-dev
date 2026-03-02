/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: 'var(--brand-50)',
                    100: 'var(--brand-100)',
                    200: 'var(--brand-200)',
                    400: 'var(--brand-400)',
                    500: 'var(--brand-500)',
                    600: 'var(--brand-600)',
                    700: 'var(--brand-700)',
                    800: 'var(--brand-800)',
                    900: 'var(--brand-900)',
                },
                gray: {
                    25: 'var(--gray-25)',
                    50: 'var(--gray-50)',
                    100: 'var(--gray-100)',
                    200: 'var(--gray-200)',
                    300: 'var(--gray-300)',
                    400: 'var(--gray-400)',
                    500: 'var(--gray-500)',
                    600: 'var(--gray-600)',
                    700: 'var(--gray-700)',
                    800: 'var(--gray-800)',
                    900: 'var(--gray-900)',
                },
                surface: {
                    0: 'var(--surface-0)',
                    1: 'var(--surface-1)',
                    2: 'var(--surface-2)',
                },
                danger: 'var(--danger)',
                success: 'var(--success)',
                warning: 'var(--warning)',
                info: 'var(--info)',
            },
            borderRadius: {
                sm: 'var(--radius-sm)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
                '2xl': 'var(--radius-2xl)',
            },
            boxShadow: {
                brand: 'var(--shadow-brand)',
            }
        },
    },
    plugins: [],
}
