import { ChatBotProvider } from '@/components/ChatBot/context';
import ChatBot from '../../components/ChatBot';
import './styles.scss'

function Home() {

  return (
    <div className='main'>
      <ChatBotProvider>
        <ChatBot />
      </ChatBotProvider>
    </div>
  );
}

export default Home