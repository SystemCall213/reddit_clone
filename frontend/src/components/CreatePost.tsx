import { useState, useEffect, useRef } from 'react'
import { TbCircleDotted } from 'react-icons/tb'
import { PiCaretDownBold } from 'react-icons/pi'
import { findCommunity, searchQuery } from '../utils/queries'
import { client } from '../utils/client'
import { AiOutlineSearch } from 'react-icons/ai'
import { v4 as uuidv4 } from 'uuid'
import { SanityDocument } from '@sanity/client'
import { CommunityProps } from './Toolbar/Toolbar'

interface CreatePostProps {
    user: SanityDocument<Record<string, any>> | undefined
}

interface ChooseCommunity {
    communityName?: string,
    communityRef?: string,
    setSearch: (searchTerm: string) => void,
    setComm: (community: any) => void
}

const ChooseCommunity: React.FC<ChooseCommunity> = ({ communityName, communityRef, setSearch, setComm }) => {
    const [refCommunity, setRefCommunity] = useState<CommunityProps | null>(null)

    useEffect(() => {
        const query = findCommunity(communityRef || communityName)
        client
            .fetch(query)
            .then((data) => setRefCommunity(data[0]))
    }, [communityRef, communityName])

    return (
        <button
            type="button"
            onClick={() => {
                setSearch("r/" + refCommunity?.communityName)
                setComm(refCommunity)
            }}
            className='w-full'
        >
            <div className='flex flex-row gap-3 p-1 items-center bg-white'>
                <img 
                    src={refCommunity?.image?.asset?.url}
                    alt='community'
                    className='w-8 h-8 rounded-full'
                />
                r/{refCommunity?.communityName}
            </div>
        </button>
    )
}

const CreatePost: React.FC<CreatePostProps> = ({ user }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [inputFocus, setInputFocus] = useState(false)
    const [focused, setFocused] = useState(false)
    const [chosenCommunity, setChosenCommunity] = useState<CommunityProps | null>(null)
    const [searchCommunities, setSearchCommunities] = useState<any[]>([])
    const [titleAreaContent, setTitleAreaContent] = useState('')
    const [textAreaContent, setTextAreaContent] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const placeholder = useRef('Choose community')
    const [requiredInfo, setRequiredInfo] = useState('')

    const searchComms = () => {
        setInputFocus(() => true)
    }

    useEffect(() => {
        setRequiredInfo(() => '')
    }, [titleAreaContent, textAreaContent, chosenCommunity])

    useEffect(() => {
        if (searchTerm.length > 0) {
            const query = searchQuery(searchTerm)

            client
                .fetch(query)
                .then((data) => setSearchCommunities(data))
        } else {
            setChosenCommunity(null)
        }
    }, [searchTerm])

    useEffect(() => {
        if (inputFocus) {
            inputRef.current?.focus()
            setInputFocus(false)
        }
    }, [inputFocus])

    const inputFocused = () => {
        setFocused(true)
        placeholder.current = 'Search communities'
    }

    const inputBlurred = () => {
        setTimeout(() => {
            setFocused(false)
        }, 100)
        placeholder.current = 'Choose a community'
    }

    const setSearch = (searchT: string) => [
        setSearchTerm(searchT)
    ]

    const setComm = (comm: any) => {
        setChosenCommunity(comm)
    }

    const handlePost = () => {
        if (chosenCommunity && titleAreaContent && textAreaContent) {
            const doc = {
                _key: uuidv4(),
                _type: 'post',
                title: titleAreaContent,
                text: textAreaContent,
                postedBy: {
                    _type: 'postedBy',
                    _ref: user?._id
                },
                upVote: 0
            }
            client.create(doc).then((createdDoc) => {
                const docReference = {
                    _key: uuidv4(),
                    _type: 'postReference',
                    _ref: createdDoc?._id
                }
                
                client
                    .patch(chosenCommunity?._id)
                    .setIfMissing({ posts: [] })
                    .insert('after', 'posts[-1]', [ docReference ])
                    .commit()
                    .then(() => console.log('posted!'))
            })
            console.log('good job!')
        } else {
            console.log('bad job!')
            setRequiredInfo('Please fill all required info')
        }
    }

    return (
        <div className="flex flex-row justify-center items-start bg-gray-300 w-full h-screen overflow-auto gap-12">
            <div className="relative flex flex-col mt-32">
                <div className="bg-gray-300 items-start text-lg font-normal border-b border-white pb-3">
                    Create a post
                </div>
                <div className='bg-white flex flex-row items-center gap-2 p-1 rounded-md shadow-md mt-6 w-1/2'>
                    {focused ? (
                        <AiOutlineSearch fontSize={25} />
                    ) : (
                        chosenCommunity ? (
                            <img 
                                src={chosenCommunity?.image?.asset?.url}
                                alt='community-image'
                                className='w-6 h-6 rounded-full'
                            />
                        ) : (
                            <TbCircleDotted fontSize={25} />
                        )
                    )}
                    <input 
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        placeholder={placeholder.current}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='outline-none w-5/6'
                        onFocus={inputFocused}
                        onBlur={inputBlurred}
                    />
                    <PiCaretDownBold onClick={searchComms} />
                </div>
                {searchTerm && focused ? (
                        <div className='absolute fixed w-1/2 mt-24'>
                            {searchCommunities?.map((community) => (
                                <ChooseCommunity key={community?._id} communityName={community?.communityName} setSearch={setSearch} setComm={setComm} />
                            ))}
                        </div>
                    ) : (
                        focused && (
                            <div className='absolute fixed w-1/2 mt-24'>
                                {user?.joinedCommunities?.map((reference: any) => (
                                    <ChooseCommunity key={reference} communityRef={reference} setSearch={setSearch} setComm={setComm} />
                                ))}
                            </div>
                        )
                    )}
                <textarea 
                    rows={1} 
                    placeholder='Title' 
                    className='mt-5 lg:w-450 md:w-350 overflow-x-hidden overflow-y-hidden break-words resize-none outline-none p-1 rounded-md' 
                    maxLength={200}
                    value={titleAreaContent}
                    onChange={(e) => {
                        e.target.style.height = 'auto'
                        e.target.style.height = `${e.target.scrollHeight}px`
                        setTitleAreaContent(e.target.value)
                    }}
                />
                <textarea 
                    rows={4} 
                    placeholder='Text (required)' 
                    className='mt-5 lg:w-450 md:w-350 min-h-100 overflow-x-hidden overflow-y-hidden break-words outline-none p-1 rounded-md' 
                    maxLength={1000}
                    value={textAreaContent}
                    onChange={(e) => {
                        e.target.style.height = 'auto'
                        e.target.style.height = `${e.target.scrollHeight}px`
                        setTextAreaContent(e.target.value)
                    }}
                />
                <div className='mt-5 flex flex-row justify-between bg-inherit items-center'>
                    <div className='text-red-500 '>
                        {requiredInfo}
                    </div>
                    <button
                        type="button"
                        onClick={handlePost}
                        className='px-8 py-2 text-blue-300 bg-white hover:text-blue-400 rounded-full font-semibold'
                    >
                        Post
                    </button>
                </div>
            </div>
            <div className="flex flex-col w-300 p-3 mt-40 bg-white rounded-md">
                <div className="text-base border-b border-gray-200 pb-2">Posting to Reddit_clone</div>
                <ol className="font-medium list-decimal list-inside text-sm">
                    <li className="border-b border-gray-200 pb-2 mt-2">Remember the human</li>
                    <li className="border-b border-gray-200 pb-2 mt-2">Behave like you would in real life</li>
                    <li className="border-b border-gray-200 pb-2 mt-2">Look for the original source of content</li>
                    <li className="border-b border-gray-200 pb-2 mt-2">Search for duplicates before posting</li>
                    <li className="border-b border-gray-200 pb-2 mt-2">Read the community's rules</li>
                </ol>
                <div></div>
            </div>
        </div>
    )
}

export default CreatePost