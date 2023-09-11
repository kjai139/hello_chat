const UserLogin = () => {
    return (
        <form className="flex flex-col gap-2">
            <div className="input-cont">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" className="custom-input" autoComplete="off"></input>
            </div>
            <div className="input-cont">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" className="custom-input"></input>
            </div>
            <div className="flex justify-between">
                <div>
                    <button className="text-blue-500 p-1">Create a new account</button>
                </div>
                <div>
                    <button className="text-blue-500 p-1">Login</button>
                </div>
            </div>
        </form>
    )
}

export default UserLogin