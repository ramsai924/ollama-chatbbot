import type { MessageType } from '@/components/ChatBot/context'
import './message.scss'
import ChatMessage from './ChatMessage';
import { ThreeDot } from 'react-loading-indicators'

function Message({ message }: { message: MessageType }) {
  const { type, content, createdDate } = message;

  if (content === 'THINIKING_LOADER') return (
    <div className={`message ${type}`} style={ {padding: '8px 24px' }}>
      <ThreeDot variant="bob" color="grey" size="small" />
    </div>
  )

  return (
    <div className={`message ${type}`}>
      <ChatMessage content={content} />
    </div>
  )
}

export default Message