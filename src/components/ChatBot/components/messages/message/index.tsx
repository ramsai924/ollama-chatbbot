import type { MessageType } from '@/components/ChatBot/context'
import './message.scss'
import ChatMessage from './ChatMessage';

function Message({ message }: { message: MessageType }) {
  const { type, content, createdDate } = message;

  return (
    <div className={`message ${type}`}>
      <ChatMessage content={content} />
    </div>
  )
}

export default Message