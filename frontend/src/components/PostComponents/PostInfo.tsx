import { useState, useEffect } from 'react'
import { BiSolidChat } from 'react-icons/bi'
import { userQuery } from '../../utils/queries'
import { client } from '../../utils/client'

interface PostInfoProps {
    userId: string,
    title: string,
    text: string,
    commentsLength: number | undefined
}

export interface PostedByProps {
    username: string,
    image: {
        asset: {
            _ref: string,
            _type: 'reference',
            url: string
        },
    },
}

const PostInfo: React.FC<PostInfoProps> = ({ userId, title, text, commentsLength }) => {
    const [postedBy, setPostedBy] = useState<PostedByProps | null>(null)

    useEffect(() => {
        const query = userQuery(userId)
        client.fetch(query).then((data) => {
            setPostedBy(data[0])
        })
    }, [userId])

    return (
        <div className='flex flex-col p-1 w-full'>
            <div className='text-xs text-gray-300'>
                Posted by u/{postedBy?.username}
            </div>
            <div className='mt-1 text-semibold text-xl'>
                {title}
            </div>
            <div className='mt-1'>
                {text}
            </div>
            <div className='mt-2 text-xs text-gray-300 flex flex-row gap-2'>
                <BiSolidChat />
                {commentsLength && commentsLength || 0}
                <div>Comments</div>
            </div>
        </div>
    )
}

export default PostInfo