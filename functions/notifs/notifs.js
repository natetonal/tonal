const notifUtils = require('./notifUtils.js');
const notifConsts = require('./notifConsts.js');

// Send a notification to a followed user and their favorites with basic follower data.
exports.sendFollowerNotification = (functions, admin) => {
    return functions.database.ref('/following/{userId}/{followedId}').onWrite(event => {
        const userId = event.params.userId;
        const followedId = event.params.followedId;

        // If the follower is unfollowing, or if the valid data wasn't sent, don't send it.
        if (!event.data.val() ||
            !event.data.val().timeStamp ||
            !event.data.val().target) {
            return;
        }

        return notifUtils.sendNotif({
            senderId: userId,
            receivingIds: [followedId],
            receivingGroups: ['favorites'],
            timeStamp: event.data.val().timeStamp,
            targets: event.data.val().target,
            type: notifConsts.ADD_FOLLOWER,
            admin
        });
    });
};

// Send notifications to a favorite and favorited user with basic follower data.
exports.sendFavoritedNotification = (functions, admin) => {
    return functions.database.ref('/favorites/{userId}/{favoritedId}').onWrite(event => {
        const userId = event.params.userId;
        const favoritedId = event.params.favoritedId;

        // If the follower is unfollowing, or if the valid data wasn't sent, don't send it.
        if (!event.data.val() ||
            !event.data.val().timeStamp ||
            !event.data.val().target) {
            return;
        }

        return notifUtils.sendNotif({
            senderId: userId,
            receivingIds: [favoritedId],
            receivingGroups: ['favorites'],
            timeStamp: event.data.val().timeStamp,
            targets: event.data.val().target,
            type: notifConsts.ADD_FAVORITE,
            admin
        });
    });
};

exports.sendPostNotification = (functions, admin) => {
    return functions.database.ref('/user-posts/{userId}/{postId}').onWrite(event => {
        const userId = event.params.userId;
        const post = event.data.val();

        // If the user deleted the post, don't send a notification.
        if (!post) {
            return;
        }

        const mentions = post.mentions || false;

        // If the user edited the post but didn't change the mentions, don't send a notification.
        if (event.data.previous.exists()){
            const prevPost = event.data.previous.val();
            const previousMentions = prevPost.mentions ? Object.keys(prevPost.mentions) : [];
            const currentMentions = mentions ? Object.keys(mentions) : [];

            if (previousMentions.length === currentMentions.length &&
                previousMentions.every(mention => currentMentions.includes(mention))){
                return;
            }
        }

        return notifUtils.sendNotif({
            senderId: userId,
            receivingGroups: ['favorites'],
            timeStamp: post.timeStamp,
            targets: mentions,
            type: notifConsts.NEW_POST,
            admin
        });
    });
};
