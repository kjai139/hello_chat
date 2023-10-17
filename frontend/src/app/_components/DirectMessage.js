import { useEffect, useState } from 'react'
import axiosInstance from '../../../axios'
import Image from 'next/image'
import UserPortrait from '../../../svgs/userPortrait.svg'
import { Robo } from '../fonts'


const DirectMessages = ({onSelect, highlight, setHL, prevTab, prevRef, suggestedUsers, onlineUsers, friendList, setFriendList}) => {

    

    const handleSelect = (node) => {
        onSelect(node)
        setHL(node._id)
        localStorage.setItem('lastSelected', node._id)

    }

    const deleteFriend = async (friendId) => {
        try {
            const response = await axiosInstance.delete(`/api/users/deleteFriend?id=${friendId}`, {
                withCredentials: true
            })

            if (response.data.success) {
                setFriendList((prev) => {
                    return prev.filter(friend => friend._id !== friendId)
                })
                console.log(response.data.message)
            }

            if (response.data.success) {
                console.log(`friend ${friendId} deleted.`)
            }
        } catch (err) {
            console.log(err)
        }
    }

    
    return (
        <ul className='flex flex-col w-full p-2'>
            <span className={`text-sm ${Robo.className} p-2`}>Free friends</span>
            {suggestedUsers && prevTab && 
            suggestedUsers.map((node) => {
                return (
                    
                    node._id === prevTab ?
                         <li key={node._id} className={highlight === node._id ? `flex p-2 hover:border-black rounded-lg border-4 border-transparent friendlist font-bold pointer-events-none` : `flex p-2 hover:border-black rounded-lg border-4 border-transparent friendlist`} onClick={() => handleSelect(node)} ref={prevRef}>
                         <div className='flex w-full justify-start items-center gap-2'>
                         <div className="w-8 relative">
                             {node.image ?
                             
                             <div className='portrait-img flex h-8 w-8'>
                             <Image src={node.image} width={30} height={30} alt="profileImg" style={{
                                 borderRadius: '50%'
                             }}></Image>
                            </div>
                             
                             
                             :
                             <UserPortrait fill={node.defaultColor} className="portrait-img"></UserPortrait>
                             }
                             <span className={node.status === 'online' || onlineUsers.includes(node._id) ? `status-indi` : `status-indi offline`}></span>
                             </div>
                             <span>{node.username}</span>
                         </div>
 
                     </li>
                     : 
                    <li key={node._id} className={highlight === node._id ? `flex p-2 hover:border-black rounded-lg border-4 border-transparent friendlist font-bold pointer-events-none` : `flex p-2 hover:border-black rounded-lg border-4 border-transparent friendlist`} onClick={() => handleSelect(node)}>
                     <div className='flex w-full justify-start items-center gap-2'>
                     <div className="w-8 relative">
                         {node.image ?
                         
                        <div className='portrait-img flex h-8 w-8'>
                        <Image src={node.image} width={30} height={30} alt="profileImg" style={{
                            borderRadius: '50%'
                        }}></Image>
                        </div>
                         
                         
                         :
                         <UserPortrait fill={node.defaultColor} className="portrait-img"></UserPortrait>
                         }
                         <span className={node.status === 'online' || onlineUsers.includes(node._id) ? `status-indi` : `status-indi offline`}></span>
                         </div>
                         <span>{node.username}</span>
                     </div>

                 </li>
                
                    
                    
                )
            })
            }
            
            <span className={`text-sm ${Robo.className} p-2`}>Your friends</span>
            {friendList && prevTab && 
            friendList.map((node) => {
                return (
                    
                    node._id === prevTab ?
                    <li key={`${node._id}-fl`} className='flex justify-between'>
                         <div className={highlight === node._id ? `flex p-2 hover:border-black rounded-lg border-4 border-transparent friendlist font-bold pointer-events-none` : `flex p-2 hover:border-black rounded-lg border-4 border-transparent friendlist`} onClick={() => handleSelect(node)} ref={prevRef}>
                         <div className='flex w-full justify-start items-center gap-2'>
                         <div className="w-8 relative">
                             {node.image ?
                             
                             <div className='portrait-img flex h-8 w-8'>
                             <Image src={node.image} width={30} height={30} alt="profileImg" style={{
                                 borderRadius: '50%'
                             }}></Image>
                            </div>
                             
                             
                             :
                             <UserPortrait fill={node.defaultColor} className="portrait-img"></UserPortrait>
                             }
                             <span className={node.status === 'online' || onlineUsers.includes(node._id) ? `status-indi` : `status-indi offline`}></span>
                             </div>
                             <span>{node.username}</span>
                             
                         </div>
 
                     </div>
                     <button type='button' className='fl-btn' onClick={() => deleteFriend(node._id)}>Delete Friend</button>
                     </li> 
                     : 
                     <li key={`${node._id}-fl`} className='flex justify-between'>
                    <div className={highlight === node._id ? `flex p-2 hover:border-black rounded-lg border-4 border-transparent friendlist font-bold pointer-events-none` : `flex p-2 hover:border-black rounded-lg border-4 border-transparent friendlist`} onClick={() => handleSelect(node)}>
                     <div className='flex w-full justify-start items-center gap-2'>
                     <div className="w-8 relative">
                         {node.image ?
                         
                        <div className='portrait-img flex h-8 w-8'>
                        <Image src={node.image} width={30} height={30} alt="profileImg" style={{
                            borderRadius: '50%'
                        }}></Image>
                        </div>
                         
                         
                         :
                         <UserPortrait fill={node.defaultColor} className="portrait-img"></UserPortrait>
                         }
                         <span className={node.status === 'online' || onlineUsers.includes(node._id) ? `status-indi` : `status-indi offline`}></span>
                         </div>
                         <span>{node.username}</span>
                     </div>

                 </div>
                 <button type='button' className='fl-btn' onClick={() => deleteFriend(node._id)}>Delete Friend</button>
                </li>
                    
                    
                )
            })
            }
            

        </ul>
    )
}


export default DirectMessages