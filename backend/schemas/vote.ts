export default {
    name: 'vote',
    title: 'Vote',
    type: 'document',
    fields: [
        {
            name: 'reaction',
            title: 'Reaction',
            type: 'number'
        },
        {
            name: 'docRef',
            title: 'DocRef',
            type: 'reference',
            to: [
                { type: 'comment' },
                { type: 'post' }
            ]
        }
    ]
}