import { AiOutlineSearch } from 'react-icons/ai'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { searchQuery } from '../../../utils/queries'
import { client } from '../../../utils/client'

interface SearchResultProps {
    communityName: string,
    imgUrl: string,
}

const SearchResult: React.FC<SearchResultProps> = ({ communityName, imgUrl }) => {
    return (
        <Link to={`community/${communityName}`} className='bg-red' >
            <div className='flex flex-row bg-white items-center lg:w-450 md:w-300 p-2 border-2 border-blue-200 shadow-md'>
                <img 
                    src={imgUrl}
                    alt="community-image"
                    className='w-10 h-10 rounded-full'
                />
                <div className='ml-4 font-light text-lg'>
                    r/{communityName}
                </div>
            </div>
        </Link>
    )
}

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])

    useEffect(() => {
        if (searchTerm.length > 0) {
            const query = searchQuery(searchTerm)

            client
                .fetch(query)
                .then((data) => {
                    setSearchResults(data)
                })
        } else {
            setSearchResults([])
        }
    }, [searchTerm])

    const inputFocused = () => {
        const searchInput = document.getElementById('addShadow')
        searchInput?.classList.remove('rounded-full', 'border-2', 'border-black-400')
        searchInput?.classList.add('rounded-t-lg', 'border-l-2', 'border-r-2', 'border-t-2', 'shadow-md', 'bg-white', 'border-blue-200')
    }

    const inputBlurred = () => {
        const searchInput = document.getElementById('addShadow')
        searchInput?.classList.add('rounded-full', 'border-2', 'border-black-400')
        searchInput?.classList.remove('rounded-t-lg', 'border-l-2', 'border-r-2', 'border-t-2', 'shadow-md', 'bg-white', 'border-blue-200')
        setTimeout(() => {
            setSearchTerm('')
        }, 100)
    }

    return (
        <div className='relative'>
            <div id='addShadow' className='rounded-full lg:w-450 md:w-300 outline-none flex flex-row border-2 border-black-400 bg-gray-200 items-center hover:shadow-md hover:bg-white hover:border-blue-200'>
                <AiOutlineSearch fontSize={25} className='m-1' />
                <input 
                    id="searchInput"
                    type='text'
                    value={searchTerm}
                    placeholder='Search Reddit'
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='flex w-[calc(90%)] outline-none bg-gray-200 bg-inherit'
                    onFocus={inputFocused}
                    onBlur={inputBlurred}
                />
            </div>
            {searchResults && (
                <div className='fixed'>
                    {searchResults?.map((community, i) => (
                        <SearchResult key={i} communityName={community?.communityName} imgUrl={community?.image?.asset?.url} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Search