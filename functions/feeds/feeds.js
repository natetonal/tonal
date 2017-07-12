exports.fanoutPostData = (functions, admin) => {
    return functions.database.ref('/posts/{postId}').onWrite(event => {
        const postId = event.params.postId;
        const post = event.data.val() || null;
        const prevPost = event.data.previous.val() || null;
        const author = post ? post.author : prevPost.author;
        const update = post ? true : null;
        const updates = {};

        return admin.database().ref(`users/${ author.uid }`).once('value')
        .then(userSnap => {
            const user = userSnap.val() || null;
            if (user){

                // Update author's info:
                updates[`/user-posts/${ author.uid }/${ postId }`] = update;
                updates[`/users/${ author.uid }/recentPost`] = postId;
                updates[`/feed/${ author.uid }/${ postId }`] = update;
                // Update user follower feeds:
                const userFollowers = user.followers ? Object.keys(user.followers) : null;
                if (userFollowers){
                    userFollowers.forEach(followerId => {
                        updates[`feed/${ followerId }/${ postId }`] = update;
                    });
                }

                return admin.database().ref().update(updates);
            }

            return;
        });
    });
};

// This will have to wait until I figure out posts a little better.
// exports.fanoutThreadData = (functions, admin) => {
//     return functions.database.ref('/thread/{postId}/{commentId}').onWrite(event => {
//         const postId = event.params.postId;
//         const commentId = event.params.commentId;
//         const comment = event.data.val() || null;
//         const prevComment = event.data.previous.val() || null;
//         const author = comment ? comment.author : prevComment.author;
//         const update = comment ? true : null;
//         const updates = {};
//
//         // A comment is changed on a thread. What needs to happen?
//         // - Anyone who is a member of the parent post (posts/{postId}), but not unfollowing/blocked/blockedBy.
//         // - Anyone who has replied to this post (but not unfollowing), but not unfollowing/blocked/blockedBy.
//         return admin.database().ref(`users/${ author.uid }`).once('value')
//         .then(userSnap => {
//             const user = userSnap.val() || null;
//             if (user){
//
//                 // Update author's info:
//                 updates[`/user-posts/${ author.uid }/${ postId }`] = update;
//                 updates[`/users/${ author.uid }/recentPost`] = postId;
//                 updates[`/feed/${ author.uid }/${ postId }`] = update;
//                 // Update user follower feeds:
//                 const userFollowers = user.followers ? Object.keys(user.followers) : null;
//                 if (userFollowers){
//                     userFollowers.forEach(followerId => {
//                         updates[`feed/${ followerId }/${ postId }`] = update;
//                     });
//                 }
//
//                 return admin.database().ref().update(updates);
//             }
//
//             return;
//         });
//     });
// };

// Update all follower & following feeds with user's post change (add, delete, edit).
exports.updateUserFeeds = (functions, admin) => {
    return functions.database.ref('/user-posts/{userId}/{postId}').onWrite(event => {
        const userId = event.params.userId;
        const postId = event.params.postId;
        const post = event.data.val() || null;
        const updates = {};

        return admin.database().ref(`users/${ userId }`).once('value')
        .then(userSnap => {

            const user = userSnap.val() || null;
            if (user){
                const userFollowers = user.followers ? Object.keys(user.followers) : null;

                if (userFollowers){
                    userFollowers.forEach(followerId => {
                        updates[`feed/${ followerId }/${ postId }`] = post;
                    });
                }

                return admin.database().ref().update(updates);
            }

            return;
        });
    });
};

exports.deleteBlockedPostsFromFeed = (functions, admin) => {
    return functions.database.ref('/users/{userUid}/blocked/{blockedUid}').onWrite(event => {
        const userUid = event.params.userUid;
        const blockedUid = event.params.blockedUid;
        const userFeedRef = admin.database().ref(`feed/${ userUid }`);
        const blockedUserFeedRef = admin.database().ref(`feed/${ blockedUid }`);
        const updates = {};

        return userFeedRef.once('value')
        .then(userFeedSnapshot => {
            const userFeed = userFeedSnapshot.val() || {};
            Object.keys(userFeed).forEach(key => {
                if (userFeed[key].author.uid === blockedUid){
                    userFeed[key] = null;
                }
            });

            return blockedUserFeedRef.once('value')
            .then(blockedUserFeedSnapshot => {
                const blockedUserFeed = blockedUserFeedSnapshot.val() || {};
                Object.keys(blockedUserFeed).forEach(key => {
                    if (blockedUserFeed[key].author.uid === userUid){
                        blockedUserFeed[key] = null;
                    }
                });

                updates[`feed/${ userUid }`] = userFeed;
                updates[`feed/${ blockedUid }`] = blockedUserFeed;

                return admin.database().ref().update(updates);
            });
        });
    });
};
