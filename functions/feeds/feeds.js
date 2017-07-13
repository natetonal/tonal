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
