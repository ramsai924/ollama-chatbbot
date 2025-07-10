import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm'

function ChatMessage({ content }: { content: string }) {
    return (
        <ReactMarkdown
            rehypePlugins={[rehypeRaw, remarkGfm]}
            components={{
                p: ({ children }) => <p className="mb-2">{children}</p>,
                table: ({ children }) => (
                    <table className="table-auto border border-gray-300 my-2">
                        {children}
                    </table>
                ),
                th: ({ children }) => (
                    <th className="border border-gray-300 px-2 py-1 bg-gray-100">
                        {children}
                    </th>
                ),
                td: ({ children }) => (
                    <td className="border border-gray-300 px-2 py-1">
                        {children}
                    </td>
                ),
                code: ({ inline, children }: any) =>
                    inline ? (
                        <code className="bg-gray-100 px-1 rounded">{children}</code>
                    ) : (
                        <pre className="bg-black text-green-200 p-2 rounded overflow-auto text-sm my-2">
                            <code>{children}</code>
                        </pre>
                    ),
                li: ({ children }) => <li className="ml-6 list-disc">{children}</li>,
            }}
        >
            {content}
        </ReactMarkdown>
    );
}

export default ChatMessage;