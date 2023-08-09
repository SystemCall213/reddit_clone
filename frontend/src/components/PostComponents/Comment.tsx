import { useState, useEffect } from 'react'
import { findComment } from '../../utils/queries'
import { client } from '../../utils/client'
import UpDownVote from './UpDownVote'
import { BiSolidChat } from 'react-icons/bi'
import CommentArea from './CommentArea'
import { v4 as uuidv4 } from 'uuid'
import { BsThreeDots } from 'react-icons/bs'
import { PatchSelection, SanityDocument } from '@sanity/client'

interface CommentProps {
    commentRef: {
        _ref: string
    },
    user: SanityDocument<Record<string, any>> | undefined,
    reply?: boolean
}

const Comment: React.FC<CommentProps> = ({ commentRef, user, reply }) => {
    const [comment, setComment] = useState<SanityDocument<Record<string, any>>>()
    const [textAreaContent, setTextAreaContent] = useState('')
    const [commentClicked, setCommentClicked] = useState(false)
    const [threeDotsClicked, setThreeDotsClicked] = useState(false)
    let commentID: PatchSelection
    if (comment) {
        commentID = comment!._id
    }

    useEffect(() => {
        const query = findComment(commentRef?._ref)

        client
            .listen(query)
            .subscribe(update => {
                setComment(update.result)
            })
        client
            .fetch(query)
            .then((data) => {
                setComment(data[0])
            })
    }, [commentRef])

    const handleComment = () => {
        setCommentClicked(true)
    }

    const postComment = () => {
        if (textAreaContent) {
            const doc = {
                _type: 'comment',
                comment: textAreaContent,
                postedBy: {
                    _type: 'postedby',
                    _ref: user?._id
                }
            }
            client
                .create(doc)
                .then((createdDoc) => {
                    const commentRef = {
                        _key: uuidv4(),
                        _type: 'commentReference',
                        _ref: createdDoc?._id
                    }

                    client
                        .patch(commentID)
                        .setIfMissing({ comments: [] })
                        .insert('after', 'comments[-1]', [ commentRef ])
                        .commit()
                        .then(() => console.log('added comment to comment'))
                })
        }
    }

    const setAreaText = (text: string) => {
        setTextAreaContent(text)
    }

    const cancel = () => {
        setCommentClicked(false)
    }

    const dotsClicked = () => {
        setThreeDotsClicked(!threeDotsClicked)
    }

    return (
        <div className='flex flex-col w-full mt-1'>
            <div className='flex flex-row items-center gap-2'>
                <img 
                    src={comment?.postedBy?.image} 
                    alt="user-image"
                    className='w-6 h-6 rounded-full' 
                />
                <div className='text-gray-300 text-xs'>{reply ? 'Replied' : 'Posted' } by {comment?.postedBy?.username}</div>
            </div>
            <div className='flex flex-row mt-2'>
                <div className='mx-2 border-2 mr-1 rounded-full'></div>
                <div className='ml-3 w-full'>
                    {comment?.comment}
                    <div className='flex flex-row gap-2 mt-1'>
                        <UpDownVote postOrCommentId={comment?._id} postOrCommentUpVote={comment?.upVote} user={user}/>
                        <button 
                            type="button"
                            onClick={handleComment}
                            className='text-xs text-gray-300 flex flex-row items-center gap-2 ml-1'
                        >
                            <BiSolidChat />
                            Reply
                        </button>
                        {comment?.comments?.length && (
                            <button
                                type='button'
                                onClick={dotsClicked}
                                className='text-gray-300'
                            >
                                <BsThreeDots />
                            </button>
                        )}
                    </div>
                    <div className='w-full'>
                        {commentClicked && (
                            <CommentArea postFunction={postComment} textAreaContent={textAreaContent} setAreaText={setAreaText} reply={true} cancelFunction={cancel} />
                        )}
                    </div>
                    {threeDotsClicked && (
                        comment?.comments?.map((commentRef: any) => (
                            <Comment key={commentRef?._ref} commentRef={commentRef} user={user} reply={true} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Comment