import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{html,md}',
  ],
  theme: {
    extend: {
      colors: {
        // Thêm nhóm màu tùy chỉnh thường được Gemini Canvas tạo ra 
        brand: { 50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 900: '#1e3a8a' },
        primary: '#3b82f6',
        secondary: '#64748b',
        bg_light: '#f8fafc',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-lora)', 'serif'],
        mono: ['var(--font-fira-code)', 'monospace'],
      },
      typography: {
        academic: {
          css: {
            '--tw-prose-body': '#3f3f46',
            '--tw-prose-headings': '#18181b',
            '--tw-prose-lead': '#52525b',
            '--tw-prose-links': '#2563eb',
            '--tw-prose-bold': '#18181b',
            '--tw-prose-counters': '#71717a',
            '--tw-prose-bullets': '#71717a',
            '--tw-prose-hr': '#e4e4e7',
            '--tw-prose-quotes': '#18181b',
            '--tw-prose-quote-borders': '#d4d4d8',
            '--tw-prose-captions': '#71717a',
            '--tw-prose-code': '#18181b',
            '--tw-prose-pre-code': '#e4e4e7',
            '--tw-prose-pre-bg': '#18181b',
            '--tw-prose-th-borders': '#d4d4d8',
            '--tw-prose-td-borders': '#e4e4e7',
            fontSize: '1.125rem',
            lineHeight: '1.75',
            h1: { fontFamily: 'var(--font-lora)', fontWeight: '700', letterSpacing: '-0.025em' },
            h2: { fontFamily: 'var(--font-lora)', fontWeight: '600', letterSpacing: '-0.025em', marginTop: '2em' },
            h3: { fontFamily: 'var(--font-lora)', fontWeight: '600' },
            blockquote: { fontStyle: 'italic', fontFamily: 'var(--font-lora)', borderLeftWidth: '4px', fontWeight: '400' },
            code: { fontFamily: 'var(--font-fira-code)', fontWeight: '400', backgroundColor: '#f4f4f5', padding: '0.2em 0.4em', borderRadius: '0.25rem' },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            a: { textDecoration: 'underline', textUnderlineOffset: '4px', textDecorationColor: '#93c5fd', transition: 'all 0.2s ease', '&:hover': { color: '#1d4ed8', textDecorationColor: '#2563eb' } }
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config

