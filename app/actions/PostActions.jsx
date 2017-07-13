import {
    databaseRef
} from 'app/firebase';
import moment from 'moment';

// If a thread, feedId is the postId
// If a main feed, the feedId is the uid.

// Even though the relationship is feed > posts > thread > replies,
// The feed > posts relationship is still maintained separately from the thread > replies relationship.

// Behaviorally, since a "thread" is a "feed" that belongs to a "post",
// The "thread" listener should handle add/delete/update functions at that one point in the db,
// Whereas a "feed" should be unique to individuals.


const fanoutPostData = (feedId, feedLoc, postId, postLoc, data) => {

    const uid = data.author.uid;
    const updates = {};

    // Update the post itself:
    updates[`${ postLoc }/${ postId }`] = data;

    return databaseRef.child(`users/${ uid }`).once('value')
    .then(userSnap => {

        const user = userSnap.val() || null;
        if (user){

            // Update post author's info:
            updates[`/user-posts/${ uid }/${ postId }`] = data;
            updates[`/users/${ uid }/recentPost`] = data;
            updates[`/${ feedLoc }/${ feedId }/${ postId }`] = data;

            // If this specifically a "post", then update user follower feeds:
            const userFollowers = user.followers ? Object.keys(user.followers) : null;

            if (userFollowers){
                userFollowers.forEach(followerId => {
                    updates[`${ feedLoc }/${ followerId }/${ postId }`] = data;
                });
            }

            // Atomic update to database
            return databaseRef.update(updates);
        }

        return false;
    });
};

export const writePost = (feedId, feedLoc, postLoc, data) => {
    return () => {
        const postId = databaseRef.child('posts').push().key;
        data.postId = postId;
        data.timeStamp = moment().format('LLLL');

        fanoutPostData({ feedId, feedLoc, postLoc, data, postId });
    };
};

export const updatePost = (feedId, feedLoc, postId, postLoc, data) => {
    return () => {
        data.postId = postId;
        data.postEdited = true;
        data.postEditedAt = moment().format('LLLL');

        fanoutPostData(feedId, feedLoc, postId, postLoc, data);
    };
};

export const deletePost = (feedId, feedLoc, postId, postLoc) => {
    return () => {
        const data = null;
        fanoutPostData(feedId, feedLoc, postId, postLoc, data);
    };
};

export const likePost = (feedId, feedLoc, postId, postLoc, data, likedId, liked) => {
    return () => {
        data.likes[likedId] = liked === true ? liked : null;
        fanoutPostData(feedId, feedLoc, postId, postLoc, data);
    };
};

export const updatePostAuthorData = (postId, data, loc) => {
    return dispatch => {
        const author = data.author;
        if (!author){ return; }

        databaseRef.child(`users/${ author.uid }`).once('value')
        .then(snapshot => {
            const newAuthor = snapshot.val();
            if (!newAuthor ||
                Object.keys(author).every(key => author[key] === newAuthor[key])){ return; }

            data.author.displayName = newAuthor.displayName;
            data.author.avatar = newAuthor.avatar;

            dispatch(updatePost(postId, data, loc));
        });
    };
};
