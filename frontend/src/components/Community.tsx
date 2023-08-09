import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { findCommunity } from '../utils/queries'
import { client } from '../utils/client'
import { v4 as uuidv4 } from 'uuid'
import CommunityPost from './CommunityPost'
import AboutCommunity from './AboutCommunity'
import PostLink from './FeedComponents/PostLink'
import { SanityDocument, PatchSelection } from '@sanity/client'
import { CommunityProps } from './Toolbar/Toolbar'

interface CommunityProperties {
    user: SanityDocument<Record<string, any>> | undefined,
}

const Community: React.FC<CommunityProperties> = ({ user }) => {
    const { communityName } = useParams()
    const [community, setCommunity] = useState<CommunityProps | null>(null)
    const [joinedHovered, setJoinedHovered] = useState(false)

    const alreadyJoined = !!(user?.joinedCommunities?.filter((reference: any) => reference?._ref === community?._id))?.length

    useEffect(() => {
        const query = findCommunity(communityName)

        client
            .fetch(query)
            .then((data) => { 
                setCommunity(data[0])
            })
    }, [communityName])

    const handleJoinedHovered = () => {
        setJoinedHovered(true)
    }

    const handleJoinedUnHovered = () => {
        setJoinedHovered(false)
    }

    const joinCommunity = () => {
        const ID: PatchSelection = user!._id
        if (!alreadyJoined) {
            client
                .patch(ID)
                .setIfMissing({ joinedCommunities: [] })
                .insert('after', 'joinedCommunities[-1]', [
                    {
                        _key: uuidv4(),
                        _type: 'communityReference',
                        _ref: community?._id
                    }
                ])
                .commit()
        }
    }

    const leaveCommunity = () => {
        let i = 0
        while (i !== user?.joinedCommunities?.length) {
            if (user?.joinedCommunities[i]._ref === community!._id) break
            i++
        } 
        client.patch(user?._id).unset([`joinedCommunities[${i}]`]).commit()
    }

    return (
        <div className='flex flex-col w-full h-full items-center'>
            <div className='flex flex-row items-start'>
                <div className='flex flex-col items-center w-656'>
                    <div className='mt-20 gap-8 rounded-lg shadow-lg p-8 flex flex-row border border-blue-300 w-full'>
                        <img 
                            src={community?.image?.asset?.url}
                            className='rounded-full h-28 w-28 -mt-20'
                        />
                        <div className='w-full h-full flex justify-center gap-4'>
                            <div className='text-2xl mr-5 uppercase'>
                                {community?.communityName}
                            </div>
                            {alreadyJoined ? (
                                joinedHovered ? (
                                    <button 
                                        className='px-4 w-20 rounded-full bg-white hover:bg-blue-200 border border-blue-300 shadow-md text-lg'
                                        type="button"
                                        onClick={leaveCommunity}
                                        onMouseLeave={handleJoinedUnHovered}
                                    >
                                        Leave
                                    </button>
                                ) : (
                                    <button 
                                        className='px-4 w-20 rounded-full bg-white hover:bg-blue-200 border border-blue-300 shadow-md text-lg'
                                        type="button"
                                        onClick={joinCommunity}
                                        onMouseEnter={handleJoinedHovered}
                                    >
                                        Joined
                                    </button>
                                )
                            ) : (
                                <button 
                                    className='px-4 w-20 rounded-full bg-white hover:bg-blue-200 border border-blue-300 shadow-md text-lg'
                                    type="button"
                                    onClick={joinCommunity}
                                >
                                    Join
                                </button>
                            )}
                        </div>
                    </div>
                    <div className='w-1 h-6 border-2 border-blue-300'></div>
                    <div className='flex flex-row items-center w-full rounded-lg border border-blue-300 shadow-md p-2'>
                        <PostLink />
                    </div>
                    {community?.posts?.map((postRef) => (
                        <Link to={`post/${postRef._ref}`} className='w-full' key={postRef._ref}>
                            <div className='flex flex-col items-center'>
                                <div className='w-1 h-6 border-2 border-blue-300'></div>
                                <div className='flex flex-row w-full rounded-lg border border-blue-300 shadow-md'>
                                    <CommunityPost postRef={postRef._ref} user={user} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className='w-6 h-1 border-2 border-blue-300 mt-32'></div>
                <div className='w-72 rounded-lg shadow-lg mt-20 border border-blue-300 p-2'>
                    <AboutCommunity description={community?.description} />
                </div>
            </div>
        </div>
    )
}

export default Community