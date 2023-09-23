

export default function Loading() {
    return (
        <main className="mx-auto max-w-5xl grid grid-cols-4 h-screen">
            
            <div className="bg-dgray text-white p-6 flex flex-col">
                <div className="flex justify-center">
                    <ul className="flex flex-col gap-4">
                        <li className="flex gap-4 userUi">
                            
                        </li>
                        <li className="flex gap-4 userUi">
                            
                        </li>
                        <li className="flex gap-4 userUi">
                            
                        </li>
                    </ul>
                </div>
                <div className="mt-auto justify-center flex">
                    
                    <div className="flex items-center gap-4">
                   
                    {/* <UserPortrait className="portrait-img"></UserPortrait> */}
                    
                    <span className="font-bold">Loading...</span>
                    </div>
                    
                </div>
            </div>
            <div className="bg-lgray text-white flex flex-col items-center">
                <h1>DIRECT MESSAGES</h1>
                
                <h1>Loading...</h1>
                

            </div>
            <div className="col-span-2 bg-ltgray">
               <h1>Loading...</h1>

            </div>
            
        </main>
    )
}