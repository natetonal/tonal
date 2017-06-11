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
                const userFollowing = user.following ? Object.keys(user.following) : null;
                if (userFollowers){
                    userFollowers.forEach(followerId => {
                        updates[`feed/${ followerId }/${ postId }`] = post;
                    });
                }

                if (userFollowing){
                    userFollowing.forEach(followingId => {
                        updates[`feed/${ followingId }/${ postId }`] = post;
                    });
                }

                return admin.database().ref().update(updates);
            }

            return;
        });
    });
};
