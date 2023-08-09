import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import UpDownVote from './PostComponents/UpDownVote'
import PostInfo from './PostComponents/PostInfo'
import { findCommunity, findPost } from '../utils/queries'
import { client } from '../utils/client'
import AboutCommunity from './AboutCommunity'
import { v4 as uuidv4 } from 'uuid'
import Comment from './PostComponents/Comment'
import CommentArea from './PostComponents/CommentArea'
import { PatchSelection, SanityDocument } from '@sanity/client'
import { CommunityProps } from './Toolbar/Toolbar'

interface PostProps {
    user: SanityDocument<Record<string, any>> | undefined
}

const Post: React.FC<PostProps> = ({ user }) => {
    const [post, setPost] = useState<SanityDocument<Record<string, any>> | undefined>(undefined)
    const [community, setCommunity] = useState<CommunityProps | null>(null)
    const [textAreaContent, setTextAreaContent] = useState('')
    const { postId, communityName } = useParams()
    let ID: PatchSelection;
    if (postId) {
        ID = postId!
    }

    useEffect(() => {
        const query = findPost(postId)
        client
            .listen(query)
            .subscribe(update => {
                setPost(update.result)
            })
        client
            .fetch(query)
            .then((data) => {
                if (data[0] !== undefined) {
                    setPost(data[0])
                }
            })
    }, [postId])

    useEffect(() => {
        const query = findCommunity(communityName)
        client
            .fetch(query)
            .then((data) => setCommunity(data[0]))
    }, [communityName])

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
                        .patch(ID)
                        .setIfMissing({ comments: [] })
                        .insert('after', 'comments[-1]', [ commentRef ])
                        .commit()
                        .then(() => console.log('added comment to post'))
                })
        }
    }

    const setAreaText = (text: string) => {
        setTextAreaContent(text)
    }

    return (
        <div className='w-full h-screen flex flex-row overflow-auto bg-gray-300 justify-center items-start gap-5'>
            <div className='flex flex-col'>
                <div className='lg:w-656 md:w-450 flex flex-row bg-white mt-4'>
                    <div className='flex flex-col bg-gray-200 p-2 items-center gap-1'>
                        <UpDownVote postOrCommentId={post?._id} postOrCommentUpVote={post?.upVote} user={user} />
                    </div>
                    <div className='flex flex-col border-b border-gray-200 w-full'>
                        <PostInfo userId={post?.postedBy?._id || post?.postedBy?._ref} title={post?.title} text={post?.text} commentsLength={post?.comments?.length} />
                        <CommentArea postFunction={postComment} textAreaContent={textAreaContent} setAreaText={setAreaText} reply={false} />
                    </div>
                </div>
                <div className='bg-white mt-3 p-2'>
                    {post?.comments?.map((commentRef: any) => (
                        <Comment key={commentRef?._ref} commentRef={commentRef} user={user} />
                    ))}
                </div>
            </div>
            <div className='flex flex-col mt-4 bg-white p-2 rounded-md'>
                <AboutCommunity description={community?.description} />
            </div>
        </div>
    )
}

export default Post