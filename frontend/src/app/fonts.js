import { Roboto_Mono, Montserrat } from "next/font/google"


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


