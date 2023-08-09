import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'
import UserProfile from '../components/UserProfile'
import Feed from './Feed'
import CreatePost from '../components/CreatePost'
import Toolbar from '../components/Toolbar/Toolbar'
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { gapi } from 'gapi-script'
import jwt_decode from 'jwt-decode'
import { client } from '../utils/client'
import { userQuery } from '../utils/queries'
import { fetchUser } from '../utils/fetchUser'
import CreateCommunity from '../components/FeedComponents/CreateCommunity'
import UserCommunities from '../components/User/UserCommunities'
import CommunitySettings from '../components/User/CommunitySettings'
import Community from '../components/Community'
import Post from '../components/Post'
import { SanityDocument } from '@sanity/client'

export interface postRefProps {
    _ref: string
}

const Home = () => {
    const [login, setLogin] = useState(false)
    const [darkened, setDarkened] = useState(false)
    const [user, setUser] = useState<SanityDocument<Record<string, any>> | undefined>(undefined)
    const [closedSidebar, setClosedSidebar] = useState(false)
    const userInfo = fetchUser()
    const location = useLocation()

    useEffect(() => {
        closeCreateCommunityPopup()
    }, [location]);

    const closeSidebar = () => {
        setClosedSidebar(!closedSidebar)
        const sidebar = document.getElementById('noSideBar')
        if (closedSidebar) {
            sidebar?.classList.add('ml-275')
        } else {
            sidebar?.classList.remove('ml-275')
        }
    }

    const clientId = '710422946973-cab3osqqvcqt1bb1nki3kku8ot7cp17r.apps.googleusercontent.com'

    useEffect(() => {
        const initClient = () => {
            gapi.auth2.init({
                clientId: clientId,
                scope: "",
            });
        };
        gapi.load("client:auth2", initClient);
    }, []);

    useEffect(() => {
        const query = userQuery(userInfo?.sub)

        client.listen(query)
            .subscribe(update => {
                setUser(update.result)
            })

        client.fetch(query)
            .then((data) => {
                setUser(data[0])
            })
    }, [])

    const clickLogin = () => {
        setLogin(true)
    }

    const logOut = () => {
        localStorage.removeItem('user')
        setUser(undefined)
    }

    const closeCreateCommunityPopup = () => {
        setDarkened(false)
        const noDark = document.getElementById('darkened')
        noDark?.classList.remove('bg-blackOverlay')
        const whenCreate = document.getElementById('when_create')
        whenCreate?.classList.remove('-z-20')
        const whenCreate2 = document.getElementById('when_create2')
        whenCreate2?.classList.remove('-z-20')
        const sideBarBg = document.getElementById('darkened_on')
        sideBarBg?.classList.remove('-z-20')
    }

    const responseGoogle = (response: CredentialResponse) => {

        if (response.credential) {
            const userResponse: any = jwt_decode(response.credential);
            localStorage.setItem('user', JSON.stringify(userResponse))

            const {sub, name, picture} = userResponse

            const doc = {
                _id: sub,
                _type: 'user',
                username: name,
                image: picture
            }

            client.createIfNotExists(doc)

            setLogin(() => false)
            const remove = document.getElementById('blurred')
            remove?.classList.remove('opacity-90', 'blur-lg', 'pointer-events-none', 'select-none')
        }
    }

    return (
        <>
        <div id='blurred'>
            <div className='fixed top-0 w-full z-10'>
                <Toolbar login={login} setLogin={clickLogin} user={user} closedSidebar={closedSidebar} setSidebar={closeSidebar} logOut={logOut} />
            </div>
            <div className='flex flex-row mt-12' id='darkened'>
                {!closedSidebar && 
                    <Sidebar user={user} closeSidebar={closeSidebar} />
                }
                <div className='ml-275 w-full h-screen' id='noSideBar'>
                        <Routes>
                            <Route path='/community/:communityName' element={<Community user={user} />} />
                            <Route path='/community/:communityName/post/:postId' element={<Post user={user} />} />
                            <Route path='/user-profile/:userId' element={<UserProfile user={user} />} />
                            <Route path='/user-communities/:userId' element={<UserCommunities />} />
                            <Route path='/create-post' element={<CreatePost user={user} />} />
                            <Route path='/community-settings/:communityId' element={<CommunitySettings />} />
                            <Route path='/*' element={<Feed setDarkenedAndShowPopup={setDarkened} user={user} />} />
                        </Routes>
                </div>
            </div>
            {darkened && <CreateCommunity closePopup={closeCreateCommunityPopup} />}
        </div>  
        {login && (
            <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center z-999'>
                <div className="flex bg-red-500 w-450 h-340 rounded-lg justify-center items-center">
                    <GoogleOAuthProvider
                        clientId={clientId}>
                        <GoogleLogin
                            onSuccess={responseGoogle}
                        />
                    </GoogleOAuthProvider>
                </div>
            </div>
        )}
        </>
    )
}

export default Home