interface AboutCommunityProps {
    description: string | undefined
}

const AboutCommunity: React.FC<AboutCommunityProps> = ({ description }) => {
    return (
        <>
            <div className='flex flex-col font-semibold mt-2'>
                About Community
            </div>
            <div className='mt-2'>
                {description}
            </div>
        </>
    )
}

export default AboutCommunity