
import { useChatBotContext } from '../../context'
import Message from './message'
import './messages.scss'

function Messages() {
  const { messages } = useChatBotContext()

  return (
    <div className='main-messages'>
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
    </div>
  )
}

export default Messages