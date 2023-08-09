export default {
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
        {
            name: 'username',
            title: 'UserName',
            type: 'string'
        },
        {
            name: 'image',
            title: 'Image',
            type: 'string'
        },
        {
            name: 'joinedCommunities',
            title: 'joinedCommunities',
            type: 'array',
            of: [{ type: 'communityReference' }]
        },
        {
            name: 'votes',
            title: 'Votes',
            type: 'array',
            of: [{ type: 'voteReference' }]
        }
    ]
}   