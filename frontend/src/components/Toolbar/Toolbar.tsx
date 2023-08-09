import Search from './ui/Search'
import { useState, useEffect } from 'react'
import LoginPopup from './ui/LoginPopup'
import { BiSolidHomeHeart } from 'react-icons/bi'
import { PiCaretDownBold, PiCaretUpBold } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { PiSidebar, PiSidebarFill } from 'react-icons/pi'
import { findCommunity } from '../../utils/queries'
import { client } from '../../utils/client'
import { useLocation } from 'react-router-dom'
import { SanityDocument } from '@sanity/client'

interface ToolbarProps {
    login: boolean,
    closedSidebar: boolean,
    setLogin: () => void,
    setSidebar: () => void,
    user: SanityDocument<Record<string, any>> | undefined,
    logOut: () => void
}

export interface CaretSidebarProps {
    communityRef: string,
}

export interface CommunityProps {
    _id: string,
    communityName: string,
    description: string,
    image: {
        asset: {
            _ref: string,
            _type: 'reference',
            url: string
        }
    },
    posts: {
        _ref: string
    }[]
}

export const CaretSidebar: React.FC<CaretSidebarProps> = ({ communityRef }) => {
    const [community, setCommunity] = useState<CommunityProps | null>(null)

    useEffect(() => {
        const query = findCommunity(communityRef)
        client
            .fetch(query).then((data) => {
                setCommunity(data[0])
            })
    }, [communityRef])

    return (
        <Link to={`/community/${community?.communityName}`}>
            <div className='flex flex-row gap-3 p-1 items-center bg-white'>
                <img 
                    src={community?.image?.asset?.url}
                    alt='community'
                    className='w-8 h-8 rounded-full'
                />
                r/{community?.communityName}
            </div>
        </Link>
    )
}

const Toolbar: React.FC<ToolbarProps> = ({ login, closedSidebar, setLogin, setSidebar, user, logOut }) => {
    const [caretActive, setCaretActive] = useState(false)
    const [sidebarIconHovered, setSidebarIconHovered] = useState(false)
    const [currentComm, setCurrentComm] = useState<any>(null)
    const {pathname} = useLocation()

    useEffect(() => {
        const query = findCommunity(pathname.split('/')[2])
        client
            .fetch(query)
            .then((data) => {
                setCurrentComm(data[0])
            })
    }, [pathname])
    

    const caretClicked = () => {
        setCaretActive(true)
    }

    const caretUnClicked = () => {
        setCaretActive(false)
    }

    const sidebarHover = () => {
        setSidebarIconHovered(true)
    }

    const sidebarUnHover = () => {
        setSidebarIconHovered(false)
    }

    const closeSidebar = () => {
        setSidebar()
        setCaretActive(false)
    }

    return (
        <div className='bg-white h-12 justify-between items-center flex flex-row'>
            <div className='relative w-275 flex flex-row justify-between items-center'>
                {pathname.length > 11 && pathname.match('/community/') ? (
                    <div className='flex flex-row gap-3 p-1 items-center bg-white'>
                        <img 
                            src={currentComm?.image?.asset?.url}
                            alt='community'
                            className='w-8 h-8 rounded-full'
                        />
                        r/{currentComm?.communityName}
                    </div>
                ) : (
                    <Link to={`/`} className='flex flex-row items-center'>
                        <BiSolidHomeHeart fontSize={32} className="ml-1.5" />
                        <div className='ml-2 font-bold mt-1'>Home</div>
                    </Link>
                )}
                <div className='flex flex-row items-center gap-2'>
                    {closedSidebar && (
                        caretActive ? (
                            <>
                                {sidebarIconHovered ? (
                                    <PiSidebarFill onMouseLeave={sidebarUnHover} onClick={closeSidebar} />
                                ) : (
                                    <PiSidebar onMouseEnter={sidebarHover} />
                                )}
                                <PiCaretUpBold onClick={caretUnClicked} />
                            </>
                        ) : (
                            <PiCaretDownBold onClick={caretClicked} />
                        )
                    )}
                </div>
                {caretActive && (
                    <div className='absolute fixed w-full mt-20'>
                        {user?.joinedCommunities.map((communityRef: any) => (
                            <CaretSidebar key={communityRef?._ref} communityRef={communityRef?._ref} />
                        ))}
                    </div>
                )}
            </div>
            <div>
                <Search />
            </div>
            <div>
                <LoginPopup login={login} setLogin={setLogin} userProfile={user} logOut={logOut} />
            </div>
        </div>
    )
}

export default Toolbar