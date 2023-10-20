import { Roboto_Mono, Montserrat, Josefin_Sans, Tilt_Neon, Rubik } from "next/font/google"


export const Robo = Roboto_Mono({
    subsets: ['latin'],
    preload: true,
    display: 'swap',
    variable: '--font-robo'
})

export const Monste = Montserrat({
    subsets: ['latin'],
    preload: true,
    display: 'swap',
    variable: '--font-inter'
})

export const Josefin = Josefin_Sans({
    subsets: ['latin'],
    variable: '--font-josefin',
    preload: true
})

export const TiltNeon = Rubik({
    subsets: ['latin'],
    display: 'swap',
})

