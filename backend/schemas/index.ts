import user from "./user";
import community from "./community";
import comment from "./comment";
import postedBy from "./postedBy";
import post from "./post";
import createdBy from "./createdBy";
import communityReference from "./communityReference";
import postReference from "./postReference";
import vote from "./vote";
import commentReference from "./commentReference";
import voteReference from "./voteReference";

export const schemaTypes = [
    createdBy, communityReference, postReference, commentReference, voteReference, vote, user, community, comment, postedBy, post
]