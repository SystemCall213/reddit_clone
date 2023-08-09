import { useState, useRef } from 'react'
import { checkNickname } from '../utils/queries'
import { client } from '../utils/client'
import { PatchSelection, SanityDocument } from '@sanity/client'

interface UserProfileProps {
    user: SanityDocument<Record<string, any>> | undefined
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    const [changeNickname, setChangeNickname] = useState(false)
    const [nickname, setNickname] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const [nicknameInUse, setNicknameInUse] = useState(false)
    let ID: PatchSelection;
    if (user) {
        ID = user!._id
    }


    const handleNickname = () => {
        setChangeNickname(true)
        setNickname('')
        setNicknameInUse(false)
        inputRef.current?.focus()
    }

    const handleBlur = () => {
        let nicknameExists = checkNickname(nickname)
        client.fetch(nicknameExists).then((data) => {
            console.log(data.length)
            nicknameExists = data.length
        }).then(() => {
            console.log(nicknameExists)
            if (!nicknameExists && nickname.length > 3) {
                client
                    .patch(ID)
                    .set({ username: nickname })
                    .commit()
            } else {
                setNicknameInUse(true)
            }
        })
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            inputRef.current?.blur();
        }
    };

    return (
        <div className='w-full h-screen flex justify-center'>
            <div className='flex flex-col items-start gap-2 p-2 bg-gray-300 lg:w-656 md:w-450'>
                <div className='flex flex-row items-center gap-3'>
                    <img 
                        src={user?.image}
                        alt="user-image"
                        className='h-10 w-10 rounded-full'
                    />
                    {changeNickname ? (
                        <input 
                            ref={inputRef}
                            type='text'
                            onChange={(e) => {if (nickname.length < 20) setNickname(e.target.value)}}
                            className='bg-inherit outline-none'
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                        />
                    ) : (
                        user?.username
                    )}
                    {nicknameInUse && (
                        <div className='text-red-400'>
                            Nickname already exists or is shorter that 4 characters
                        </div>
                    )}
                </div>
                <button
                    type='button'
                    onClick={handleNickname}
                    className='px-2 bg-inherit border border-gray-400 rounded-full'
                >
                    Change Nickname
                </button>
            </div>
        </div>
    )
}

export default UserProfile