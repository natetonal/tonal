const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

/* CONSTANTS */
/* --------- */

// LIMITERS:
const MAX_NOTIFICATIONS = 10;

// NOTIFICATION TYPES:
const NOTIF_ADD_FOLLOWER = 'follower-add';
const GROUP_TYPES = []; // Notifs that should be grouped.
const SOLO_TYPES = [NOTIF_ADD_FOLLOWER]; // Notifs that should be displayed individually.

// Send a notification to a followed user with basic follower data.
exports.sendFollowerNotification = functions.database.ref('/followers/{followedUid}/{followerUid}').onWrite(event => {
    const followedUid = event.params.followedUid;
    const type = NOTIF_ADD_FOLLOWER;

    // If the follower is unfollowing, there's no need for a notification.
    if (!event.data.val()) {
        return;
    }

    const notifId = admin.database().ref(`/notifications/${ followedUid }/`).push().key;
    const follower = event.data.val();

    // Make sure the followed user hasn't blocked or unfollowed the follower.
    return admin.database().ref(`users/${ followedUid }/settings`)
    .once('value')
    .then(snapshot => {

        const followedSettings = snapshot.val();
        const displayNotifs = followedSettings.displayNotifs;
        const blockedUsers = Object.keys(followedSettings.blockedUsers);

        if (displayNotifs &&
            !blockedUsers.includes(follower.uid)){
            const updates = {};
            const newNotif = {
                type,
                uid: follower.uid,
                username: follower.username,
                displayName: follower.displayName,
                avatar: follower.avatar,
                timeStamp: follower.timeStamp,
                acknowledged: false,
                clicked: false
            };

            // Store new notif.
            updates[notifId] = newNotif;
            return admin.database().ref(`/notifications/${ followedUid }`).update(updates);
        }
    });
});

// Trim, delete, and group notifications if needed.
exports.updateNotifications = functions.database.ref('/notifications/{uid}/{notifId}').onWrite(event => {

    // User just deleted a notification - no need for updates.
    if (!event.data.val()){
        return;
    }

    const notif = event.data.val();
    const notifsRef = event.data.ref.parent;
    const updates = {};

    return notifsRef.once('value')
    .then(snapshot => {

        // Erase any duplicates (thereby updating any previous notificiations of same type & user).
        snapshot.forEach(child => {
            if (child.val().uid === notif.uid &&
                child.val().type === notif.type &&
                child.key !== event.data.key){
                updates[child.key] = null;
            }
        });

        // Limit notifications to MAX_NOTIFICATIONS.
        if (snapshot.numChildren() >= MAX_NOTIFICATIONS) {
            let childCount = 0;
            snapshot.forEach(child => {
                if (++childCount <= snapshot.numChildren() - MAX_NOTIFICATIONS) {
                    updates[child.key] = null;
                }
            });
        }

        // Update this user's notifications.
        return notifsRef.update(updates);
    });


});
