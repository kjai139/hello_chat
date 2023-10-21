import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
import { SkeletonTheme } from "react-loading-skeleton"


export default function Loading() {
    return (
        <SkeletonTheme baseColor="#94a3b8" highlightColor="#e2e8f0">
        <main className="mx-auto max-w-5xl grid grid-cols-4 h-screen">
            
            <div className="bg-dgray text-white p-6 flex flex-col">
                <div className="flex justify-center">
                    <ul className="flex flex-col gap-4">
                        <li className="flex gap-4 userUi">
                            <Skeleton count={1} height={20} width={100}></Skeleton>
                        </li>
                        <li className="flex gap-4 userUi">
                        <Skeleton count={1} height={20} width={100}></Skeleton>
                        </li>
                        <li className="flex gap-4 userUi">
                        <Skeleton count={1} height={20} width={100}></Skeleton>
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
                
                <Skeleton count={5} height={30} containerClassName="p-4 w-full flex flex-col flex-1" className="gap-2 flex"/>
                

            </div>
            <div className="col-span-2 bg-ltgray">
                <div className="flex flex-col flex-1 max-h-screen">
                <div className="flex p-4 gap-2 border-b-2 selected-top items-center">
                    
                   
                    
                    <Skeleton count={1} height={30} containerClassName="w-full"></Skeleton>
            
                    </div>
                    <div className="text-white p-4 flex flex-col gap-4 overflow-y-auto">
                        <Skeleton count={5} containerClassName="gap-2 flex flex-col"  height={60}></Skeleton>
                    
                </div>
                </div>

            </div>
            
        </main>
        </SkeletonTheme>
    )
}