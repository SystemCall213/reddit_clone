
interface CommentAreaProps {
    postFunction: () => void,
    textAreaContent: string,
    setAreaText: (text: string) => void,
    reply: boolean,
    cancelFunction?: () => void
}

const CommentArea: React.FC<CommentAreaProps> = ({ postFunction, textAreaContent, setAreaText, reply, cancelFunction }) => {
    return (
        <div className='flex flex-col border border-gray-300 mt-2 rounded-md mb-2 mx-1'>
            <textarea 
                rows={4} 
                className='min-h-100 outline-none overflow-x-hidden overflow-y-hidden break-words p-1'
                placeholder='What are your thoughts?'
                maxLength={1000}
                value={textAreaContent}
                onChange={(e) => {
                    e.target.style.height = 'auto'
                    e.target.style.height = `${e.target.scrollHeight}px`
                    setAreaText(e.target.value)
                }}
            />
            <div className='flex flex-row bg-gray-300 justify-between p-2 rounded-b-md'>
                <div></div>
                <div className='flex flex-row gap-2'>
                    {reply && (
                        <button
                            type="button"
                            className='px-3 text-blue-400 rounded-full font-semibold hover:bg-gray-200'
                            onClick={cancelFunction}
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="button"
                        className='px-3 bg-blue-400 rounded-full text-white font-semibold hover:bg-blue-500'
                        onClick={postFunction}
                    >
                        {reply ? 'Reply' : 'Comment'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CommentArea