import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { PiCaretDownBold, PiCaretUpBold } from 'react-icons/pi'
import { SanityDocument } from "@sanity/client";

interface LoginPopupProps {
    login: boolean,
    setLogin: () => void,
    userProfile: SanityDocument<Record<string, any>> | undefined
    logOut: () => void
}

const LoginPopup: React.FC<LoginPopupProps> = ({ login, setLogin, userProfile, logOut }) => {
    const [toggleCaret, setToggleCaret] = useState(false)

    const handleCaretDown = () => { setToggleCaret(true) }
    const handleCaretUp = () => { setToggleCaret(false) }

    useEffect(() => {
        if (login) {
            const blur = document.getElementById('blurred')
            blur?.classList.add('opacity-90', 'blur-lg', 'pointer-events-none', 'select-none')
        }
    }, [login])

    return (
        <>
            {userProfile ? (
                <div className="flex flex-row w-20 items-center">
                    <Link to={`user-profile/${userProfile?._id}`} className='flex gap-2 items-center'>
                        <img 
                            className='rounded-full w-10 h-10 mr-3 shadow-xl object-cover'
                            src={userProfile.image}
                            alt='user-pic'
                        />
                    </Link>
                    {toggleCaret ? (
                        <>
                            <div className="">
                                <button
                                    type="button"
                                    onClick={handleCaretUp}
                                >
                                    <PiCaretUpBold />
                                </button>
                            </div>
                            <div className="fixed flex flex-col items-start top-0 gap-2 right-0 mt-12 border border-blue-300 bg-blue-200 p-2">
                                <Link 
                                    onClick={handleCaretUp} 
                                    to={`/user-communities/${userProfile?._id}`} 
                                >
                                    Your communities
                                </Link>
                                <button
                                    type="button"
                                    onClick={logOut}
                                >
                                    Log out
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="">
                            <button
                                type="button"
                                onClick={handleCaretDown}
                            >
                                <PiCaretDownBold />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    type="button"
                    className='bg-red-300 rounded-full px-3 py-1 text-white font-bold'
                    onClick={setLogin}
                >
                    Log In
                </button>
            )}
        </>
    )
}

export default LoginPopup