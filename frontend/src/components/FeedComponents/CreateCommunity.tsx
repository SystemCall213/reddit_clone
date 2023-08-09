import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { AiOutlineClose, AiOutlineInfoCircle } from 'react-icons/ai'
import { BsFillPersonFill } from 'react-icons/bs'
import { ImEye } from 'react-icons/im'
import { BiSolidLockAlt } from 'react-icons/bi'
import { nameTakenQuery, userQuery } from '../../utils/queries'
import { client } from '../../utils/client'
import { fetchUser } from '../../utils/fetchUser'
import { SanityDocument } from '@sanity/client'

interface CreateCommunityProps {
    closePopup: () => void,
}

const CreateCommunity: React.FC<CreateCommunityProps> = ({ closePopup }) => {
    const [user, setUser] = useState<SanityDocument<Record<string, any>> | undefined>(undefined)
    const [infoHovered, setInfoHovered] = useState(false)
    const [communityName, setCommunityName] = useState('')
    const [type, setType] = useState('publicCommunity')
    const [noComName, setNoComName] = useState(false)
    const [noComNameSupport, setNoComNameSupport] = useState(false) // it is needed so it is impossible to add community when user enters the createCommunity popup and immediately presses the create community button
    const [nameTaken, setNameTaken] = useState(false)
    const [nameTakenSupport, setNameTakenSupport] = useState(false)
    const restrictedSymbols = '"\'!@#$%^&*()+=-<>,/\\`~'
    const [restrictedName, setRestrictedName] = useState(false)

    function checkRestricted(communityName: string, setRestrictedName: Dispatch<SetStateAction<boolean>>) {
        for (let i = 0; i < restrictedSymbols.length; i++) {
            for (let j = 0; j < communityName.length; j++) {
                if (restrictedSymbols[i] === communityName[j]) {
                    return setRestrictedName(() => true)
                }
            }
        }
        return setRestrictedName(() => false)
    }

    const userInfo = fetchUser()

    useEffect(() => {
        const query = userQuery(userInfo?.sub)

        client.fetch(query)
            .then((data) => {
                setUser(data[0])
            })
    }, [])

    useEffect(() => {
        if (!communityName) { setNoComName(() => true) } else setNoComName(() => false)
        const query = nameTakenQuery(communityName)
        client.fetch(query)
            .then((data) => {
                if (data[0]?.communityName === communityName) {
                    setNameTaken(() => true)
                } else setNameTaken(() => false)
            })
    }, [communityName])

    const handleCommunityType = (e: any) => {
        setType(JSON.stringify(e.target.value).slice(1, e.target.value.length+1))
    }

    const handleInfoHover = () => {
        setInfoHovered(true)
    }

    const handleInfoUnhover = () => {
        setInfoHovered(false)
    }

    const handleCreateCommunity = () => {
        const query = nameTakenQuery(communityName)
        client.fetch(query)
            .then((data) => {
                console.log(data[0]?.communityName)
                console.log(data[0]?.communityName === communityName)
                if (data[0]?.communityName === communityName) {
                    setNameTaken(() => true)
                } else setNameTaken(() => false)
            })
        if (!communityName) { setNoComName(() => true) } else setNoComName(() => false)
        checkRestricted(communityName, setRestrictedName)
        if (!nameTaken && restrictedName === false && noComName === false && noComNameSupport) {
            const doc = {
                _type: 'community',
                communityName,
                type,
                createdBy: {
                    _type: 'createdBy',
                    _ref: user?._id
                },
            }
            client.create(doc)
                .then(() => closePopup)
        }
        setNoComNameSupport(true)
    }

    const inputFocused = () => {
        const comInput = document.getElementById('createCommunityInput')
        comInput?.classList.replace('border', 'border-2')
        comInput?.classList.replace('border-gray-300', 'border-black')
        setNoComNameSupport(() => false)
        setNameTakenSupport(() => false)
    }

    const inputUnfocused = () => {
        const comInput = document.getElementById('createCommunityInput')
        comInput?.classList.replace('border-2', 'border')
        comInput?.classList.replace('border-black', 'border-gray-300')
        const query = nameTakenQuery(communityName)
        client.fetch(query)
            .then((data) => {
                if (data[0]?.communityName === communityName) {
                    setNameTaken(true)
                } else setNameTaken(false)
            })
        if (!communityName) { setNoComName(true) } else setNoComName(false)
        checkRestricted(communityName, setRestrictedName)
        setNoComNameSupport(() => true)
        setNameTakenSupport(() => true)
    }

    return (
        <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center'>
            <div className="flex bg-white w-656 rounded-lg flex-col items-start p-4">
                <div className='flex w-full justify-between items-center flex-row border-b-2 border-gray-200 pb-3'>
                    <div className='font-semibold'>
                        Create a community
                    </div>
                    <button
                        type="button"
                        onClick={closePopup}
                    >
                        <AiOutlineClose fontSize={18} />
                    </button>
                </div>
                <div className='flex flex-col justify-between w-full mt-3'>
                    <div className='text-lg font-semibold'>Name</div>
                    <div className='flex flex-row items-center'>
                        <div className='text-gray-400 text-sm mr-2'>
                            Community names including capitalization cannot be changed.
                        </div>
                        <AiOutlineInfoCircle 
                            onMouseEnter={handleInfoHover} 
                            onMouseLeave={handleInfoUnhover}
                        />
                        {infoHovered && (
                            <div className='absolute fixed w-60 ml-72 mt-40 bg-black text-white text-xs p-2 rounded-md'>
                                Names cannot have spaces (e.g., "r/bookclub" not "r/book club"),
                                must be between 3-21 characters, and underscores ("_") are the
                                only special characters allowed. Avoid using solely trademarked names 
                                (e.g., "r/FansOfAcme" not "r/Acme")
                            </div>
                        )}
                    </div>
                </div>
                <div id='createCommunityInput' className='mt-5 w-full flex flex-row items-center border border-gray-300 rounded-md focus:border-2 focus:border-black'>
                    <span className='ml-2'>r/</span>
                    <input 
                        type="text"
                        value={communityName}
                        onChange={(e) => {if (communityName.length < 21) setCommunityName(e.target.value)}}
                        onFocus={inputFocused}
                        onBlur={inputUnfocused}
                        className='p-1 w-full outline-none mr-3'
                    />
                </div>
                <div className='text-sm mt-2 text-gray-400'>
                    {21 - communityName.length} Characters remaining
                </div>
                <div className='text-sm mt-3 text-red-500'>
                    {nameTaken && nameTakenSupport && (
                        <>This community name is already taken</>
                    )}
                    {noComName && noComNameSupport && (
                        <>A community name is required</>
                    )}
                    {restrictedName && (
                        <>Community names must be between 3-21 characters,
                        and can only contain letters, numbers, or underscores.</>
                    )}
                </div>
                <div className='mt-4 font-semibold text-lg'>   
                    Community type
                </div>
                <div className='flex flex-row mt-1 items-center'>
                    <input type="radio" name="typeOfCommunity" value="publicCommunity" checked={type === "publicCommunity"} onChange={handleCommunityType} className='mr-2'/>
                    <BsFillPersonFill className="mr-2 text-gray-600" />
                    <p className='font-semibold mr-2 text-gray-600'>Public</p>
                    <p className='text-sm text-gray-400'>Anyone can view, post, and comment to this community</p>
                </div>
                <div className='flex flex-row mt-1 items-center'>
                    <input type="radio" name="typeOfCommunity" value="restrictedCommunity" checked={type === "restrictedCommunity"} onChange={handleCommunityType} className='mr-2' />
                    <ImEye className="mr-2 text-gray-600" />
                    <p className='font-semibold mr-2 text-gray-600'>Restricted</p>
                    <p className='text-sm text-gray-400'>Anyone can view this community, but only approved users can post</p>
                </div>
                <div className='flex flex-row mt-1 items-center'>
                    <input type="radio" name="typeOfCommunity" value="privateCommunity" checked={type === "privateCommunity"} onChange={handleCommunityType} className='mr-2' />
                    <BiSolidLockAlt className="mr-2 text-gray-600" />
                    <p className='font-semibold mr-2 text-gray-600'>Private</p>
                    <p className='text-sm text-gray-400'>Only approved users can view and submit to this community  </p>
                </div>
                <div className='flex flex-row w-[calc(100%+2rem)] -ml-4 -mb-4 mt-4 bg-gray-100 p-4 justify-between rounded-b-lg'>
                    <div></div>
                    <div className='flex flex-row items-center gap-4'>
                    <button
                        type="button"
                        onClick={closePopup}
                        className='pr-4 pl-4 pt-1 pb-1 rounded-full bg-white-500 font-bold text-blue-600 border-2 border-blue-500 hover:bg-gray-200'
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleCreateCommunity}
                        className='pr-4 pl-4 pt-1.5 pb-1.5 rounded-full bg-blue-600 font-bold text-white hover:bg-blue-500'
                    >
                        Create Community
                    </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateCommunity