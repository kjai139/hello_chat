import Image from "next/image"
import UserPortrait from '../../../svgs/userPortrait.svg'

const ChatWindow = ({selectedUser, userId, msgs, user}) => {
    return (
        <div>
            <div className="flex p-4 gap-2 border-b-2 selected-top">
            {selectedUser && selectedUser.image ? 
                <Image src={selectedUser.image} className='portrait-img'></Image> : selectedUser &&
                <UserPortrait className="portrait-img" fill={selectedUser && selectedUser.defaultColor && selectedUser.defaultColor}></UserPortrait>
            }
                <span className="text-white font-bold">{selectedUser && selectedUser.username}</span>
            
            </div>
            {msgs && msgs.map((node, idx) => {
                return (
                    <div className={node.sender === user._id ? 'userMsg-div' : 'incMsg-div'} key={node._id}>
                        
                    </div>    
                )
            })}

        </div>
    )
}

export default ChatWindow