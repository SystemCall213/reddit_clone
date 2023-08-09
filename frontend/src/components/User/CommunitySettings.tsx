import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { client } from '../../utils/client'
import { SanityImageAssetDocument } from '@sanity/client'
import { HiFolderDownload } from 'react-icons/hi'
import { FiTrash } from 'react-icons/fi'
import { BiSolidTrashAlt } from 'react-icons/bi'

const CommunitySettings = () => {
    const [imageAsset, setImageAsset] = useState<SanityImageAssetDocument | null>(null)
    const [wrongImageType, setWrongImageType] = useState(false)
    const [changesSaved, setChangesSaved] = useState(false)
    const [trashCan, setTrashCan] = useState(false)
    const [communityDescription, setCommunityDescription] = useState('')
    const [requiredInfo, setRequiredInfo] = useState(false)
    const { communityId } = useParams()

    const uploadImage = (e: any) => {
        const { type, name } = e.target.files[0]

        if (type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff') {
            setWrongImageType(false)

            client.assets.upload('image', e.target.files[0], { contentType: type, filename: name })
                .then((document) => {
                    setImageAsset(document)
                })
                .catch((error) => {
                    console.log('image error', error)
                }) 
        } else {
            setWrongImageType(true)
        }
    }

    const SaveChanges = () => {
        if (imageAsset && communityDescription) {
            setRequiredInfo(false)
            setChangesSaved(true)

            client
                .patch(communityId!)
                .set({
                    image: {
                        _type: 'image',
                        asset: {
                            _key: imageAsset?._id,
                            _type: 'reference',
                            _ref: imageAsset?._id
                        }
                    },
                    description: communityDescription
                })
                .commit()
                .then(() => console.log(imageAsset?._id))
        } else {
            setRequiredInfo(true)
        }
    }

    const FilledTrashCan = () => {
        setTrashCan(true)
    }

    const HollowTrashCan = () => {
        setTrashCan(false)
    }

    const deleteImageAsset = () => {
        setImageAsset(null)
    }

    return (
        <div className='flex flex-col items-center h-full'>
            <h1 className='font-bold my-10 border shadow-lg rounded-full p-2'>Edit your community</h1>
            <div className='bg-gray-400 border border-gray-600 p-2 shadow-lg'>
                {!imageAsset ? (
                    <label>
                        <div className='bg-inherit border border-dotted w-340 h-340 flex flex-col justify-center items-center'>
                            <HiFolderDownload fontSize={30} />
                            <div>Add image to your community</div>
                            <div className='text-base text-gray-300 p-2'>image should be of JPG, SVG, PNG or GIF format less than 20 MB</div>
                            <input 
                                type="file"
                                name='upload-image'
                                onChange={uploadImage}
                                className='w-0 h-0'
                            />
                        </div>
                    </label>
                ) : (
                    <>
                        {wrongImageType && (<></>)}
                        <img 
                            src={imageAsset.url}
                            alt='community-image'
                        />
                        <div className='w-full flex flex-row justify-between mt-2'>
                            <div></div>
                            <div 
                                onMouseEnter={FilledTrashCan} 
                                onMouseLeave={HollowTrashCan}
                                onClick={deleteImageAsset}
                            >
                                {trashCan ? (
                                    <BiSolidTrashAlt />
                                ) : (
                                    <FiTrash />
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className='mt-3 flex flex-col items-center bg-blue-300 p-2 rounded-md w-450'>
                <div className='my-2 bg-inherit text-lg'>Add description</div>
                <textarea 
                    rows={4} cols={50}
                    value={communityDescription}
                    onChange={(e) => {if (communityDescription.length < 300) setCommunityDescription(e.target.value)}}
                    className='bg-inherit border border-blue-400 rounded-md outline-none p-1 w-full whitespace-normal'
                />
            </div>
            <div className='mt-3 w-450 flex flex-row justify-between'>
                <div></div>
                {changesSaved ? (
                    <div className='p-2 rounded-full border bg-blue-300 shadow-md hover:bg-blue-400 hover:border hover:border-blue-500'>Changes saved!</div>
                ) : (
                    <button 
                        onClick={SaveChanges}
                        className='p-2 rounded-full border bg-blue-300 shadow-md hover:bg-blue-400 hover:border hover:border-blue-500'
                    >
                        Save changes
                    </button>
                )}
            </div>
            {requiredInfo && (
                <div className='mt-2 text-red-500 text-base w-450 flex justify-center'>
                    <div>Insert required data!</div>
                </div>
            )}
        </div>
    )
}

export default CommunitySettings