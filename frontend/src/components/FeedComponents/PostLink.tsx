import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BsSignpost } from 'react-icons/bs'
import { BsFillSignpostFill } from 'react-icons/bs'

const PostLink = () => {
    const [postHovered, setPostHovered] = useState(false)
    
    const handlePostHover = () => {
        setPostHovered(true)
    }

    const handlePostUnHover = () => {
        setPostHovered(false)
    }
    return (
        <>
            <div
                onMouseEnter={handlePostHover}
                onMouseLeave={handlePostUnHover}
            >
                {postHovered ? (
                    <BsFillSignpostFill fontSize={24} />
                ) : (
                    <BsSignpost fontSize={24} />
                )}
            </div>
            <Link to='/create-post'
                className='w-full'
            >
                <input type="text" placeholder='Create a post' className='outline-none w-full rounded-lg ml-2'/>
            </Link>
        </>
        
    )
}

export default PostLink