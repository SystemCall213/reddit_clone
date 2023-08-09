export default {
    name: 'comment',
    title: 'Comment',
    type: 'document',
    fields: [
        {
            name: 'postedBy',
            title: 'PostedBy',
            type: 'postedBy'
        },
        {
            name: 'comment',
            title: 'Comment',
            type: 'string'
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