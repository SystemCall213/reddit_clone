import { useState, useEffect } from 'react'
import { useNavigate, Link } from "react-router-dom"
import PostLink from '../components/FeedComponents/PostLink'
import { allComms } from '../utils/queries'
import { client } from '../utils/client'
import CommunityPost from '../components/CommunityPost'
import { SanityDocument } from '@sanity/client'
import { CommunityProps } from '../components/Toolbar/Toolbar'
interface FeedProps {
    setDarkenedAndShowPopup: React.Dispatch<React.SetStateAction<boolean>>,
    user: SanityDocument<Record<string, any>> | undefined
}

const Feed: React.FC<FeedProps> = ({ setDarkenedAndShowPopup, user }) => {
    const [allCommunities, setAllCommunities] = useState<CommunityProps[] | null>([])
    const navigate = useNavigate()

    useEffect(() => {
        const query = allComms()
        client
            .fetch(query)
            .then((data) => {
                console.log(data)
                setAllCommunities(data)
            })
    }, [])

    const handleCreatePost = () => {
        navigate('/create-post')
    }

    const handleCreateCommunity = () => {
        setDarkenedAndShowPopup(true)
        const dark = document.getElementById('darkened')
        dark?.classList.add('bg-blackOverlay')
        const whenCreate = document.getElementById('when_create')
        whenCreate?.classList.add('-z-20')
        const whenCreate2 = document.getElementById('when_create2')
        whenCreate2?.classList.add('-z-20')
        const sideBarBg = document.getElementById('darkened_on')
        sideBarBg?.classList.add('-z-20')
    }

    return (
        <div className='flex flex-row justify-center gap-2 items-start'>
            <div id='when_create2' className='w-656 p-2 flex flex-col gap-2'>
                <div className='flex flex-row w-full rounded-md border-2 border-gray-200 p-2'>
                    <PostLink />
                </div>
                {allCommunities?.map((community: CommunityProps) => (   
                    community?.posts?.map((postRef) => (
                        <Link key={postRef?._ref} to={`community/${community?.communityName}/post/${postRef?._ref}`} className='border-2 border-gray-200 rounded-md'>
                            <div className='flex flex-row'>
                                <CommunityPost postRef={postRef._ref} user={user} />
                            </div>
                        </Link>
                    ))
                ))}
            </div>
            <div id='when_create' className='flex flex-col w-350 rounded-lg mt-2 border-gray-200 items-center border-2 sticky top-0'>
                <h2 className='font-medium mt-1 text-lg py-3'>Home</h2>
                <p className='ml-4 mr-3 border-b-2 border-gray-100 pb-5'>Your personal Reddit-clone frontpage. 
                    Come here to check in with your favorite communities.
                </p>
                <button
                    type="button"
                    onClick={handleCreatePost}
                    className='mt-5 ml-2 mr-2 pt-1.5 pb-1.5 rounded-full bg-blue-600 w-5/6 font-bold text-white hover:bg-blue-500'
                >
                    Create Post
                </button>
                <button
                    type="button"
                    onClick={handleCreateCommunity}
                    className='mt-3 mb-5 ml-2 mr-2 pt-1 pb-1 rounded-full bg-white-500 w-5/6 font-bold text-blue-600 border-2 border-blue-500 hover:bg-gray-50'
                >
                    Create Community
                </button>
            </div>
        </div>
    )
}

export default Feed