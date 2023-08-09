import { useEffect, useState } from "react"
import { fetchUser } from "../../utils/fetchUser"
import { userCommunities, userQuery } from "../../utils/queries"
import { client } from "../../utils/client"
import { BsGear } from 'react-icons/bs'
import { PiGearSixFill } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { SanityDocument } from "@sanity/client"

interface CommunityProps {
    communityName: string,
    type: string,
    id: string,
    image: string
}

const MapCommunity: React.FC<CommunityProps> = ({ communityName, type, id, image }) => {
    const [hover, setHover] = useState(false)

    const handleGearHover = () => {
        setHover(true)
    }

    const handleGearUnHover = () => {
        setHover(false)
    }

    return (
        <div className="flex flex-col w-350 border border-gray-300 items-center justify-start gap-5">
            <div className="">
                <img 
                    src={image}
                    alt='community-image'
                    className="rounded-full w-10 h-10 hidden"
                    id="community_image"
                />
            </div>
            <div className="flex flex-row">
                <div className="mr-2">Community name:</div>
                {communityName}
            </div>
            <div>
                {type === 'publicCommunity' ? (
                    <div>Community type: public</div>
                ) : (
                    type === 'restrictedCommunity' ? (
                        <div>Community type: restricted</div>
                    ) : (
                        <div>Community type: private</div>
                    )
                )}
            </div>
            <div className="flex flex-row pr-2 pb-2 w-full justify-between">
                <div></div>
                {hover && (
                        <div className="absolute text-xs bg-black text-white rounded-md border border-gray-300 mt-6 ml-96 p-1">Configure community</div>
                    )}
                <div onMouseEnter={handleGearHover} onMouseLeave={handleGearUnHover}>
                    {hover ? (
                        <Link to={`/community-settings/${id}`}>
                            <PiGearSixFill />
                        </Link>
                    ) : (
                        <BsGear />
                    )}
                </div>
            </div>
        </div>
    )
}

const UserCommunities = () => {
    const [communities, setCommunities] = useState<any[]>([])
    const [user, setUser] = useState<SanityDocument<Record<string, any>> | undefined>(undefined)
    const userInfo = fetchUser()

    useEffect(() => {
        const query = userQuery(userInfo?.sub)

        client.fetch(query)
            .then((data) => {
                setUser(data[0])
            })
    }, [userInfo?.sub])

    useEffect(() => {
        const query = userCommunities(user?._id)

        client.fetch(query)
            .then((data) => {
                setCommunities(data)
            })
    }, [user?._id])

    return (
        <div className="flex flex-col gap-10 mt-16 items-center">
            {communities?.map((community) => (
                <MapCommunity
                    key={`${community?.communityName}`} 
                    communityName={community?.communityName}
                    type={community?.type}
                    id={community?._id}
                    image={community?.image}
                />
            ))}
        </div>
    )
}

export default UserCommunities