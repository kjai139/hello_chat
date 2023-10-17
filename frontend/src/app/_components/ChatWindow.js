import Image from "next/image"
import UserPortrait from '../../../svgs/userPortrait.svg'
import { useContext, useEffect, useRef, useState } from "react"
import axiosInstance from '../../../axios'
import socket from "../../../socket"
import { addMinutes, format, isToday, isWithinInterval, isYesterday, parseISO } from "date-fns"
import { userContext } from "../_context/authContext"


const ChatWindow = ({selectedUser, msgs, user, setMsgs, blankMsg}) => {

    
    const [message, setMessage] = useState('')
    
    const chatRef = useRef(null)

   

    useEffect(() => {
        
        requestAnimationFrame(scrollToBottom)
    }, [msgs])

  

    

    
    

    const scrollToBottom = () => {
        console.log('chatref', chatRef.current)
        if (selectedUser && chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight
        }
    }

    const sendMessage = async (e) => {
        e.preventDefault()

        

        if (!blankMsg && msgs.length > 0) {
            const dateNow = new Date()
            const lastMsg = msgs[msgs.length -1 ]
            const lastMsgId = lastMsg._id
            const parsedTime = parseISO(lastMsg.timestamp)
            const endTime = addMinutes(parsedTime, 1)

            console.log('lastmsg Id:', lastMsg.sender._id, user._id)

            if (user._id === lastMsg.sender._id && isWithinInterval(dateNow, {
                start: parsedTime,
                end: endTime
            })) {
                console.log(`${dateNow} is within 1 minute of ${parsedTime} and ${endTime}`)
                //within 1 min, add msg to last
                try {
                    const response = await axiosInstance.post('/api/messages/edit', {
                        message: message,
                        messageId: lastMsgId,
                        recipientId: selectedUser._id
                    }, {
                        withCredentials: true
                    })

                    if (response.data.success) {
                        setMessage('')
                    }

                    

                } catch (err) {
                    console.log(err)
                    
                }
            } else {
                console.log(`${dateNow} is not within 1 minute of ${parsedTime} and ${endTime}`)
                try {
                    const response = await axiosInstance.post('/api/messages/send', {
                        message: message,
                        users: [user._id, selectedUser._id],
                        sender: user._id,
                        recipientId: selectedUser._id
                    }, {
                        withCredentials: true
                    })
                    console.log('message:', message)
                    console.log('users:', user, selectedUser)
                    if (response.data.success) {
                        setMessage('')
                    }
                } catch (err) {
                    console.log(err)
                }
            }

        } else {
            console.log('first msg')
            try {
                const response = await axiosInstance.post('/api/messages/send', {
                    message: message,
                    users: [user._id, selectedUser._id],
                    sender: user._id,
                    recipientId: selectedUser._id
                }, {
                    withCredentials: true
                })
                console.log('message:', message)
                console.log('users:', user, selectedUser)
                if (response.data.success) {
                    setMessage('')
                }
            } catch (err) {
                console.log(err)
            }
        }
        

    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            sendMessage(e)
        } else if (e.key === 'Enter' && e.shiftKey) {
            
        }
    }
    return (
        <div className="flex flex-col flex-1 max-h-screen">
            <div className="flex p-4 gap-2 border-b-2 selected-top items-center">
            {selectedUser && selectedUser.image ? 
                <div className='portrait-img flex h-8 w-8'>
                <Image src={selectedUser.image} className='portrait-img' width={30} height={30} alt="profileImg" style={{
                    borderRadius:'50%'
                }}></Image>
                </div> 
                : selectedUser &&
                <UserPortrait className="portrait-img" fill={selectedUser && selectedUser.defaultColor && selectedUser.defaultColor}></UserPortrait>
            }
                <span className="text-white font-bold">{selectedUser && selectedUser.username}</span>
            
            </div>
            <div className="text-white p-4 flex flex-col gap-4 overflow-y-auto" ref={chatRef}>
            {blankMsg && !msgs &&
                <div>
                <h1>Say hi to {selectedUser.username}~</h1>
                </div>
            }
            {msgs && msgs.map((node, idx) => {
                // console.log(node, 'node')

                let parsedDate = parseISO(node.timestamp)

                let formattedTimestamp
                if (isToday(parsedDate)) {
                    formattedTimestamp = format(parsedDate, "'Today at' hh:mm aa")
                } else if (isYesterday(parsedDate)) {
                    formattedTimestamp = format(parsedDate, "'Yesterday at' hh:mm aa")
                } else {
                    formattedTimestamp = format(parsedDate, "MM/dd/yyyy 'at' hh:mm aa")
                }


                return (
                    <div className='flex gap-2' key={node._id}>
                        
                        {node.sender.image ? 
                             <div className='portrait-img flex h-8 w-8'>
                             <Image src={node.sender.image} width={30} height={30} alt="profileImg" style={{
                                 borderRadius: '50%'
                             }}></Image>
                            </div> :
                            <UserPortrait className="portrait-img" fill={node.sender.defaultColor}></UserPortrait>
                            }
                        
                        <div className="flex flex-col">
                            <div className="flex gap-2 items-center">
                            <span className="font-bold">{node.sender.username}</span>
                            <span className="text-xs">{formattedTimestamp}</span>
                            </div>
                            <span className="whitespace-pre-wrap">{node.content}</span>
                        </div>
                    </div>    
                )
            })}
            </div>
            {
                selectedUser &&
                <form onSubmit={sendMessage} className="p-4 flex items-end flex-1">
                    <textarea placeholder={`Message@${selectedUser.username}`} value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyPress} className="resize-none w-full p-2 text-black"></textarea>
                </form>
            }

        </div>
    )
}

export default ChatWindow