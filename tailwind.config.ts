import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/*-contexts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'xs': '30rem',
      'sm': '40rem',
      'md': '48rem',
      'lg': '64rem',
      'xl': '80rem',
      '2xl': '96rem',
      '3xl': '112rem',
      '4xl': '128rem',
      '5xl': '144rem',
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        primaryVariant: "var(--primary-variant)",
        secondary: "var(--secondary)",
        secondaryVariant: "var(--secondary-variant)",
        tertiary: "var(--tertiary)",
        tertiaryVariant: "var(--tertiary-variant)",
        darksteelblue: 'var(--color-darksteelblue)',
        darksdeepskyblueVariant: 'var(--color-darksteelblue-variant)',
        deepskyblue: 'var(--color-deepskyblue)',
        deepskyblueVariant: 'var(--color-deepskyblue-variant)',
        lightseagreen: 'var(--color-lightseagreen)',
        lightseagreenVariant: 'var(--color-lightseagreen-variant)',
        darkaqua: 'var(--color-darkaqua)',
        darkaquaVariant: 'var(--color-darkaqua-variant)',
        darkgreen: 'var(--color-darkgreen)',
        darkgreenVariant: 'var(--color-darkgreen-variant)',
        peachpuff: 'var(--color-peachpuff)',
        peachpuffVariant: 'var(--color-peachpuff-variant)',
        darkpapayawhip: 'var(--color-darkpapayawhip)',
        darkpapayawhipVariant: 'var(--color-darkpapayawhip-variant)',
        salmon: 'var(--color-salmon)',
        salmonVariant: 'var(--color-salmon-variant)',
        darkcrimson: 'var(--color-darkcrimson)',
        darkcrimsonVariant: 'var(--color-darkcrimson-variant)',
        orchid: 'var(--color-deepskyblue)',
        orchidVariant: 'var(--color-orchid-variant)',
        darklavender: 'var(--color-darklavender)',
        darklavenderVariant: 'var(--color-darklavender-variant)',
        blueviolet: 'var(--color-blueviolet)',
        bluevioletVariant: 'var(--color-blueviolet-variant)',
        lavender: 'var(--color-lavender)',
        lavenderVariant: 'var(--color-lavender-variant)',
        lemonchiffon: 'var(--color-lemonchiffon)',
        lemonchiffonVariant: 'var(--color-lemonchiffon-variant)',
        darkkhaki: 'var(--color-darkkhaki)',
        darkkhakiVariant: 'var(--color-darkkhaki-variant)',
        gold: 'var(--color-gold)',
        goldVariant: 'var(--color-gold-variant)',
        darkmoccasin: 'var(--color-darkmoccasin)',
        darkmoccasinVariant: 'var(--color-darkmoccasin-variant)',
        chocolatefondue: 'var(--color-chocolatefondue)',
        chocolatefondueVariant: 'var(--color-chocolatefondue-variant)',
        pantone: 'var(--color-pantone)',
        pantoneVariant: 'var(--color-pantone-variant)',
      },
      height: {
        '88': '22rem',
        '104': '26rem',
        '112': '28rem',
        '120': '30rem',
        '128': '32rem',
        '136': '34rem',
        '144': '36rem',
        '152': '38rem',
        '160': '40rem',
        '168': '42rem',
        '176': '44rem',
        '184': '46rem',
        '192': '48rem',
        '200': '50rem',
      },
      width: {
        '88': '22rem',
        '104': '26rem',
        '112': '28rem',
        '120': '30rem',
        '128': '32rem',
        '136': '34rem',
        '144': '36rem',
        '152': '38rem',
        '160': '40rem',
        '168': '42rem',
        '176': '44rem',
        '184': '46rem',
        '192': '48rem',
        '200': '50rem',
        '1/7': '14.28%',
        '2/7': '28.57%',
        '3/7': '42.29%',
        '4/7': '57.14%',
        '5/7': '71.42%',
        '6/7': '85.71%',
        '1/8': '12.5%',
        '2/8': '25%',
        '3/8': '37.5%',
        '4/8': '50%',
        '5/8': '62.5%',
        '6/8': '75%',
        '7/8': '87.5%',
      },
    },
  },
  plugins: [],
} satisfies Config;
