import MessageForm from './components/MessageForm'
import Messages from './components/messages'
import './Chatbot.scss'

function ChatBot() {
    return (
        <div className='main-chatbot'>
            <Messages />
            <MessageForm />
        </div>
    )
}

export default ChatBot