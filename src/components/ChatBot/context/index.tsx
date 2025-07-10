import {
    createContext,
    useContext,
    useState,
    type Dispatch,
    type SetStateAction,
    type ReactNode
} from "react";

export interface MessageType {
    type: 'sent' | 'received';
    content: string;
    createdDate: Date;
}

interface ChatBotContextType {
    messages: MessageType[];
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    error: any;
    setError: Dispatch<SetStateAction<any>>;
    createdMessage: (message: MessageType) => void;
    updateLastMessage: (updatedContent: string) => void;
}

export const ChatBotContext = createContext<ChatBotContextType>({
    messages: [],
    isLoading: false,
    setIsLoading: () => { },
    error: null,
    setError: () => { },
    createdMessage: () => { },
    updateLastMessage: () => { }
});

export const ChatBotProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<MessageType[]>([
        {
            type: 'received',
            content: 'Hello 👋🏾! How can I assist you today?',
            createdDate: new Date()
        }
    ]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    const createdMessage = (message: MessageType) => {
        setMessages(prevMessages => [...prevMessages, message]);
    };

    const updateLastMessage = (updatedContent: string) => {
        setMessages(prevMessages => {
            if (prevMessages.length === 0) return prevMessages;
            const last = prevMessages[prevMessages.length - 1];
            if (last.type !== 'received') return prevMessages;

            const updatedMessage = { ...last, content: updatedContent };
            return [...prevMessages.slice(0, -1), updatedMessage];
        });
    };

    return (
        <ChatBotContext.Provider
            value={{
                messages,
                isLoading,
                setIsLoading,
                error,
                setError,
                createdMessage,
                updateLastMessage
            }}
        >
            {children}
        </ChatBotContext.Provider>
    );
};

export const useChatBotContext = () => useContext(ChatBotContext);
  