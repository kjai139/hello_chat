'use client'

import { useState } from "react"
import { Roboto, Josefin_Sans } from "next/font/google"


const roboto = Roboto({
    subsets: ['latin'],
    variable: '--font-roboto',
    weight: ['400', '700']
})

const josefin = Josefin_Sans({
    subsets: ['latin'],
    variable: '--font-josefin'
})



const UserLogin = () => {

    const [isUserCreatingAcc, setIsUserCreatingAcc] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const handleCreateAcc = (e) => {
        e.preventDefault()
        setIsUserCreatingAcc(true)
    }

    const handleBacktoLogin = (e) => {
        e.preventDefault()
        setIsUserCreatingAcc(false)
    }


    return (
        <div className="shadow-cont p-4 animate-slide-in">
        <h1 className="font-bold md:text-2xl lg:text-3xl">Hello Chat Messenger</h1>
        <form className="flex flex-col gap-2">
            {isUserCreatingAcc ? 
            <h1 className={`${josefin.variable} font-josefin animate-fade-in`}>Creating account</h1>
            :
            <h1 className={`${josefin.variable} font-josefin`}>Log In</h1>
            }
            <div className="input-cont">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" className="custom-input" autoComplete="off"></input>
            </div>
            <div className="input-cont">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" className="custom-input"></input>
            </div>
           {isUserCreatingAcc ? 
           <div className="flex justify-between">
           <div>
               <button className="text-blue-500 p-1 animate-fade-in" onClick={handleBacktoLogin}>{'<- Back to Login'}</button>
           </div>       
           
           <div>
               <button className="text-blue-500 p-1 animate-fade-in">Create Account</button>
           </div>
           </div>
           :
           <div className="flex justify-between">
                  
                <div>
                    <button className="text-blue-500 p-1" onClick={handleCreateAcc}>Create a new account</button>
                </div>
                <div>
                    <button className="text-blue-500 p-1">Login</button>
                </div>
            </div>}
        </form>
        </div>
    )
}

export default UserLogin