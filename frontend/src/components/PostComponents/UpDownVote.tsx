import { ImArrowDown, ImArrowUp } from 'react-icons/im'
import { useEffect, useState } from 'react'
import { client } from '../../utils/client'
import { v4 as uuidv4 } from 'uuid'
import { findVoteByRef } from '../../utils/queries'
import { PatchSelection, SanityDocument } from '@sanity/client'

interface UpDownVoteProps {
    postOrCommentId: string | undefined,
    postOrCommentUpVote: number,
    user: SanityDocument<Record<string, any>> | undefined
}

const UpDownVote: React.FC<UpDownVoteProps> = ({ postOrCommentId, postOrCommentUpVote, user }) => {
    const [upVoteClicked, setUpVoteClicked] = useState(false)
    const [downVoteClicked, setDownVoteClicked] = useState(false)
    let ID: PatchSelection;
    if (user) {
        ID = user!._id
    }

    useEffect(() => {
        user?.votes?.map((reference: any) => {
            const query = findVoteByRef(reference?._ref)
            client  
                .fetch(query)
                .then((data) => {
                    if (data[0]?.docRef?._id === postOrCommentId) {
                        data[0]?.reaction === 1 ? setUpVoteClicked(() => true) : setDownVoteClicked(() => true)
                    }
                })
        })
    }, [postOrCommentId, user?.votes])

    const upVote = () => {
        if (downVoteClicked) unVote()
        client
            .patch(postOrCommentId!)
            .setIfMissing({ upVote: 0 }) 
            .inc({ ['upVote'] : 1})
            .commit()
            .catch((error) => console.log(postOrCommentId, error))

        const doc = {
            _type: 'vote',
            reaction: 1,
            docRef: {
                _type: 'reference',
                _ref: postOrCommentId
            }
        }

        client
            .create(doc)
            .then((createdDoc) => {
                const Reference = {
                    _key: uuidv4(),
                    _type: 'voteReference',
                    _ref: createdDoc?._id
                }

                client
                    .patch(ID)
                    .setIfMissing({ votes: [] })
                    .insert('after', 'votes[-1]', [ Reference ])
                    .commit()
            })
    }

    const downVote = () => {
        if (upVoteClicked) unVote()
        client
            .patch(postOrCommentId!)
            .dec({ ['upVote'] : 1})
            .commit()

        const doc = {
            _type: 'vote',
            reaction: 0,
            docRef: {
                _type: 'reference',
                _ref: postOrCommentId
            }
        }

        client
            .create(doc)
            .then((createdDoc) => {
                const Reference = {
                    _key: uuidv4(),
                    _type: 'voteReference',
                    _ref: createdDoc?._id
                }

                client
                    .patch(ID)
                    .setIfMissing({ votes: [] })
                    .insert('after', 'votes[-1]', [ Reference ])
                    .commit()
            })
    }

    const unVote = () => {
        if (upVoteClicked) {
            client
                .patch(postOrCommentId!)
                .setIfMissing({ upVote: 0 }) 
                .dec({ ['upVote'] : 1})
                .commit()
            setUpVoteClicked(false)
        } else {
            client
                .patch(postOrCommentId!)
                .setIfMissing({ upVote: 0 }) 
                .inc({ ['upVote'] : 1})
                .commit()
            setDownVoteClicked(false)
        }
        user?.votes?.map((reference: any, i: number) => {
            console.log(reference._ref)
            console.log(postOrCommentId)
            const query = findVoteByRef(reference?._ref)
            client.fetch(query).then((data) => {
                if (data[0]?.docRef?._id === postOrCommentId) {
                    console.log('matched')
                    client
                        .patch(user?._id)
                        .unset([`votes[${i}]`])
                        .commit()
                        .then(() => {
                            client.delete(data[0]._id)
                        })
                }
            })
        })
    }

    const handleUpVote = () => {
        setUpVoteClicked(() => true)
    }

    const handleUpUnVote = () => {
        setUpVoteClicked(() => false)
    }

    const handleDownVote = () => {
        setDownVoteClicked(() => true)
    }

    const handleDownUnVote = () => {
        setDownVoteClicked(() => false)
    }

    return (
        <>
            {upVoteClicked ? (
                <button
                    type="button"
                    onClick={(e) => {
                        unVote()
                        handleUpUnVote()
                        e.preventDefault()
                    }}
                    className='text-blue-300'
                >
                    <ImArrowUp />
                </button>
            ) : (
                <button
                    type="button"
                    onClick={(e) => {
                        upVote()
                        handleUpVote()
                        e.preventDefault()
                    }}
                >
                    <ImArrowUp />
                </button>
            )}
            {postOrCommentUpVote === null || undefined || !postOrCommentUpVote ? 0 : postOrCommentUpVote}
            {downVoteClicked ? (
                <button
                    type="button"
                    onClick={(e) => {
                        unVote()
                        handleDownUnVote()
                        e.preventDefault()
                    }}
                    className='text-blue-300'
                >
                    <ImArrowDown />
                </button>
            ) : (
                <button
                    type="button"
                    onClick={(e) => {
                        downVote()
                        handleDownVote()
                        e.preventDefault()
                    }}
                >
                    <ImArrowDown />
                </button>
            )}
        </>
    )
}

export default UpDownVote