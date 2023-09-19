import Image from "next/image"
import UserPortrait from '../../../svgs/userPortrait.svg?url'

const ChatWindow = ({convoId, msgs, user}) => {
    return (
        <div>
            {msgs && msgs.map((node, idx) => {
                return (
                    <div className={node.sender === user._id ? 'userMsg-div' : 'incMsg-div'} key={node._id}>
                        <Image src={user.image ? user.image : UserPortrait}></Image>
                        <span>
                            {node.content}
                        </span>
                    </div>    
                )
            })}

        </div>
    )
}

export default ChatWindow