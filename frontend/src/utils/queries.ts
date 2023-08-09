export const userQuery = (userId: string) => {
    const query = `*[_type == "user" && _id == '${userId}']`;
    return query;
};

export const nameTakenQuery = (name: string) => {
    const query = `*[_type == "community" && communityName == '${name}']{
        _id, communityName, type
    }`
    return query
}

export const userCommunities = (userId: string | undefined) => {
    const query = `*[_type == "community" && references('${userId}')]{
        _id, communityName, type, image
    }`
    return query
}

export const findCommunity = (communityName: string | undefined) => {
    const query = `*[_type == "community" && communityName == '${communityName}' || _id == '${communityName}']{
        _id,
        communityName,
        type,
        createdBy -> {
            _id,
            username,
            image,
            joinedCommunities
        },
        image {
            asset -> {
                _id,
                url 
            } 
        },
        description,
        posts
    }`
    return query
}

export const searchQuery = (searchTerm: string) => {
    const query = `*[_type == "community" && communityName match '${searchTerm}*']{
        communityName,
        image {
            asset -> {
                url
            }
        }
    }`
    return query
}

export const findPost = (reference: string | undefined) => {
    const query = `*[_type == "post" && _id == '${reference}']{
        _id,
        title,
        text,
        postedBy -> {
            _id,
            username
        },
        comments,
        upVote
    }`
    return query
}

export const findComment = (commentReference: string | undefined) => {
    const query = `*[_type == "comment" && _id == "${commentReference}"]{
        _id,
        postedBy -> {
            _id,
            username,
            image
        },
        comment,
        comments,
        upVote
    }`
    return query
}

export const findVoteByRef = (reference: string) => {
    const query = `*[_type == "vote" && _id == "${reference}"]{
        _id,
        reaction,
        docRef -> {
            _id
        }
    }`
    return query
}

export const checkNickname = (nickname: string) => {
    const query = `*[_type == "user" && username == '${nickname}']`
    return query
}

export const allComms = () => {
    const query = `*[_type == "community"]`
    return query
}