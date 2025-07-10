
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MdSend } from "react-icons/md";
import { useChatBotContext } from "../../context";
import './MessagingForm.scss'

const modalName = 'mistral';

function MessageForm() {
    const { createdMessage, updateLastMessage } = useChatBotContext();

    const handleApiResponse = async (message: string) => {
        // Step 1: Add empty "received" message
        createdMessage({
            type: 'received',
            content: 'THINIKING_LOADER',
            createdDate: new Date(),
        });

        // Step 2: Start streaming
        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: modalName,
                prompt: `${message}

                    ### Instruction:
                    Respond in plain, conversational language unless the user explicitly asks for formatted output such as a table, list, or code block.

                    Only use Markdown formatting (like | for tables, 1. for lists, or \`\`\` for code) if the user clearly requests specific formatting, layout, or asks you to 'show', 'display', or 'format' something.

                    For casual greetings or general questions, respond naturally like a helpful assistant.`,
                stream: true,
            }),
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");

        if (!reader) return;

        let fullMessage = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
                try {
                    const json = JSON.parse(line);
                    if (json.response) {
                        fullMessage += json.response;
                        updateLastMessage(fullMessage);
                    }
                } catch (err) {
                    console.error("Failed to parse stream chunk:", err);
                }
            }
        }
    };
    
    const onmessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.querySelector('input') as HTMLInputElement;
        const message = input.value.trim(); // Get the input value
        if(!message) return;
        createdMessage({
            type: 'sent',
            content: message,
            createdDate: new Date()
        })
        handleApiResponse(message) //Stimulate API response
        input.value = '';
    }

  return (
    <div className='main-form'>
        <form className="form-content" onSubmit={onmessageSubmit}>
              <Input className="input" type="text" placeholder="Enter a message" />
              <Button type="submit" variant="outline" size="sm" className="send-message"><MdSend /></Button>
        </form>
    </div>
  )
}

export default MessageForm