import { Roboto } from "next/font/google"
import UserLogin from "./_components/UserLogin"


const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['400', '700']
})

export default function Home() {
  return (
    <main className="flex flex-col h-screen justify-center items-center">
      <div className="shadow-cont p-4">
        <h1 className="font-bold md:text-2xl lg:text-3xl">Hello Chat Messenger</h1>
        <UserLogin></UserLogin>
      </div>
      
    </main>
  )
}
