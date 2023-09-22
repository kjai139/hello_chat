'use client'

import { createContext, useContext, useState } from "react";


const userContext = createContext()

const UserProvider = ({children}) => {
    const [user, setUser] = useState()
    const [selectedUser, setSelectedUser] = useState()

    return (
        <userContext.Provider value={{
            user, setUser, selectedUser, setSelectedUser
        }}>{children}</userContext.Provider>
    )
}

export { userContext, UserProvider }