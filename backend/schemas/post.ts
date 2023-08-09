export default {
    name: 'post',
    title: 'Post',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'text',
            title: 'Text',
            type: 'string',
        },
        {
            name: 'postedBy',
            title: 'PostedBy',
            type: 'postedBy',
        },
        {
            name: 'comments',
            title: 'Comments',
            type: 'array',
            of: [{ type: 'commentReference' }]
        },
        {
            name: 'upVote',
            title: 'UpVote',
            type: 'number'
        }
    ]
}