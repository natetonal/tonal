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


const fanoutPostData = ({ feedId, feedLoc, postId, postLoc, data, authorId }) => {

    const uid = data ? data.author.uid : authorId;
    const updates = {};

    // Update the post itself:
    updates[`${ postLoc }/${ postId }`] = data;

    return databaseRef.child(`users/${ uid }`).once('value')
    .then(userSnap => {

        const user = userSnap.val() || null;
        if (user){

            // Update post author's info:
            updates[`user-posts/${ uid }/${ postId }`] = data;
            updates[`users/${ uid }/recentPost`] = data;
            updates[`${ feedLoc }/${ feedId }/${ postId }`] = data;

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
    console.log('writePost called.');
    return () => {
        const postId = databaseRef.child('posts').push().key;
        data.postId = postId;
        data.timeStamp = moment().format('LLLL');

        return fanoutPostData({ feedId, feedLoc, postLoc, data, postId });
    };
};

export const updatePost = (feedId, feedLoc, postId, postLoc, data) => {
    console.log('updatePost called.');
    return () => {
        data.postId = postId;
        data.postEdited = true;
        data.postEditedAt = moment().format('LLLL');

        return fanoutPostData({ feedId, feedLoc, postId, postLoc, data });
    };
};

export const deletePost = (feedId, feedLoc, postId, postLoc) => {
    console.log('deletePost called.');

    return (dispatch, getState) => {
        const authorId = getState().auth.uid;
        const data = null;

        return fanoutPostData({ feedId, feedLoc, postId, postLoc, data, authorId });
    };
};

export const likePost = (feedId, feedLoc, postId, postLoc, likedId, liked, data) => {
    console.log('likePost called.');

    return () => {
        return databaseRef.child(`${ postLoc }/${ postId }`)
        .transaction(post => {
            if (post) {
                if (post.likesCount && post.likes[likedId]) {
                    data.likes[likedId] = null;
                } else {
                    if (!data.likes) {
                        data.likes = {};
                    }
                    data.likes[likedId] = moment().format('LLLL');
                }

                let count = 0;
                Object.keys(data.likes).forEach(key => {
                    if (data.likes[key]){
                        count += 1;
                    }
                });

                data.likesCount = count;
                fanoutPostData({ feedId, feedLoc, postId, postLoc, data });
            }

            return data;
        });
    };
};

export const updatePostAuthorData = (feedId, feedLoc, postId, postLoc, data) => {
    console.log('updatePostAuthorData called.');

    return () => {
        const author = data.author;
        if (!author){ return; }

        databaseRef.child(`users/${ author.uid }`).once('value')
        .then(snapshot => {
            const newAuthor = snapshot.val();
            if (!newAuthor ||
                Object.keys(author).every(key => author[key] === newAuthor[key])){ return; }

            // Change info that user can edit:
            data.author.displayName = newAuthor.displayName;
            data.author.avatar = newAuthor.avatar;

            fanoutPostData({ feedId, feedLoc, postId, postLoc, data });
        });
    };
};

export const updatePostImageData = (feedId, feedLoc, postId, postLoc, data) => {
    console.log('updatePostImageData called with data: ', data);

    return () => {

        console.log('data.image?', data.image);
        if (!data.image){ return; }

        console.log('data.image? ', data.image);
        const image = data.image;
        const ownerId = image.ownerId;
        const imageId = image.imageId;

        if (!ownerId || !imageId){ return; }

        databaseRef.child(`user-images/${ ownerId }/${ imageId }`).once('value')
        .then(snapshot => {

            const newImage = snapshot.val();
            if (!newImage ||
                Object.keys(newImage).every(key => image[key] === newImage[key])){ return; }

            // Change info that user can edit or things returning from DB:
            data.image.thumbs = newImage.thumbs;
            data.image.albums = newImage.albums;
            data.image.caption = newImage.caption;

            fanoutPostData({ feedId, feedLoc, postId, postLoc, data });

        });
    };
};
