import { useState, useEffect } from 'react'
import { findPost } from '../utils/queries'
import { client } from '../utils/client'
import UpDownVote from './PostComponents/UpDownVote'
import PostInfo from './PostComponents/PostInfo'
import { SanityDocument } from '@sanity/client'


interface CommunityPostProps {
    postRef: string | undefined,
    user: SanityDocument<Record<string, any>> | undefined
}

const CommunityPost: React.FC<CommunityPostProps> = ({ postRef, user }) => {
    const [post, setPost] = useState<SanityDocument<Record<string, any>> | undefined>(undefined)

    useEffect(() => {
        const query = findPost(postRef)
        client
            .listen(query)
            .subscribe(update => {
                if (update.result !== undefined) {
                    setPost(update.result)
                }
            })
        client
            .fetch(query)
            .then((data) => {
                if (data[0] !== undefined) {
                    setPost(data[0])
                }
            })
    }, [postRef])

    return (
        <>
            <div className='flex flex-col bg-gray-200 p-2 items-center gap-1'>
                <UpDownVote postOrCommentId={post?._id} postOrCommentUpVote={post?.upVote} user={user} />
            </div>
            <PostInfo userId={post?.postedBy?._id || post?.postedBy?._ref} title={post?.title} text={post?.text} commentsLength={post?.comments?.length} />
        </>
    )
}

export default CommunityPost