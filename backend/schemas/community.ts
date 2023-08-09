export default {
    name: 'community',
    title: 'Community',
    type: 'document',
    fields: [
        {
            name: 'communityName',
            title: 'CommunityName',
            type: 'string'
        },
        {
            name: 'type',
            title: 'Type',
            type: 'string'
        },
        {
            name: 'createdBy',
            title: 'CreatedBy',
            type: 'createdBy'
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
        },
        {
            name: 'description',
            title: 'Description',
            type: 'string'
        },
        {
            name: 'posts',
            title: 'Posts',
            type: 'array',
            of: [{ type: 'postReference' }]
        }
    ]
}