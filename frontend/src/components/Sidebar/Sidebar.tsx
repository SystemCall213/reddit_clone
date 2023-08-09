import { useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { BiSolidHomeHeart } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { findCommunity } from '../../utils/queries'
import { client } from '../../utils/client'
import { SanityDocument } from '@sanity/client'
import { CommunityProps } from '../Toolbar/Toolbar'

interface SidebarProps {
    user: SanityDocument<Record<string, any>> | undefined,
    closeSidebar: () => void,
}

interface UserCommunityProps {
    communityRef: string,
    uuid: string
}

const UserCommunity: React.FC<UserCommunityProps> = ({ communityRef, uuid }) => {
    const [community, setCommunity] = useState<CommunityProps | null>(null)

    useEffect(() => {
        const query = findCommunity(communityRef)
        client
            .fetch(query)
            .then((data) => {
                setCommunity(data[0])
            })
    }, [community, communityRef])

    const Hovered = () => {
        const sidebar_com = document.getElementById(uuid)
        sidebar_com?.classList.add('bg-gray-100')
    }

    const UnHovered = () => {
        const sidebar_com = document.getElementById(uuid)
        sidebar_com?.classList.remove('bg-gray-100')
    }

    return (
        <Link to={`community/${community?.communityName}`}>
            <div id={uuid} className='p-2 flex flex-row items-center gap-4' onMouseEnter={Hovered} onMouseLeave={UnHovered}>
                <img 
                    src={community?.image?.asset?.url}
                    alt="community"
                    className='w-10 h-10 rounded-full'
                />
                <div>{community?.communityName}</div>
            </div>
        </Link>
    )
}

const Sidebar: React.FC<SidebarProps> = ({ user, closeSidebar }) => {
    return (
        <div className='fixed flex bg-white w-275 h-screen' id='darkened_on'>
            <div className='w-full h-full flex flex-col'>
                <div className='flex flex-row justify-between mt-2 mb-2'>
                    <div></div>
                    <AiOutlineClose fontSize={25} className='hover:bg-gray-300 rounded-md' onClick={closeSidebar} />
                </div>
                <div className='flex flex-col w-full h-full overflow-scroll p-2'>
                    {/* // tut filter */}
                    <div className='text-xs uppercase text-gray-400'>
                        your communities
                    </div>
                    <div className='mt-2 flex flex-col'>
                        {user?.joinedCommunities?.map((communityRef: any) => (
                            <UserCommunity key={communityRef._ref} communityRef={communityRef._ref} uuid={uuidv4()} />
                        ))}
                    </div>
                    <div className='mt-2 text-xs uppercase text-gray-400'>
                        feeds
                    </div>
                    <div className='p-1'>
                        <Link to={`/`} className='flex flex-row items-center'>
                            <BiSolidHomeHeart fontSize={32} />
                            <div className='ml-2 mt-1'>Home</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar