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
    const followerUid = event.params.followerUid;
    const followedUid = event.params.followedUid;
    const type = NOTIF_ADD_FOLLOWER;

    // If the follower is unfollowing, there's no need for a notification.
    if (!event.data.val()) {
        return;
    }

    const notifId = admin.database().ref(`notifications/${ followedUid }/`).push().key;
    const timeStamp = event.data.val();

    // Get the most recent follower data (and make sure they exist).
    return admin.database().ref(`users/${ followerUid }`)
    .once('value')
    .then(followerSnap => {

        const follower = followerSnap.val();
        console.log('follower? ', follower);
        if (follower){

            // Make sure the followed user hasn't blocked or unfollowed the follower.
            return admin.database().ref(`users/${ followedUid }/settings`)
            .once('value')
            .then(followedSnap => {

                const followedSettings = followedSnap.val();
                const displayNotifs = followedSettings.displayNotifs;
                const blocked = followedSettings.blockedUsers ?
                    Object.keys(followedSettings.blockedUsers).includes(follower.uid) : false;

                console.log('followed displayNotifs? ', displayNotifs);
                console.log('followed blocked? ', blocked);

                if (displayNotifs &&
                    !blocked){
                    const updates = {};
                    const newNotif = {
                        type,
                        uid: follower.uid,
                        username: follower.username,
                        displayName: follower.displayName,
                        avatar: follower.avatar,
                        acknowledged: false,
                        timeStamp
                    };

                    // Store new notif.
                    updates[notifId] = newNotif;
                    return admin.database().ref(`notifications/${ followedUid }`).update(updates);
                }
            });
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

// Count user's followers when changed.
exports.countFollowers = functions.database.ref('/followers/{followedUid}/{followerUid}').onWrite(event => {
    const followerUid = event.params.followerUid;
    const followedUid = event.params.followedUid;
    const followStatus = event.data.val();
    const followersRef = event.data.ref.parent;
    const updates = {};

    return followersRef.once('value')
    .then(followerSnap => {

        // Update followers object with new information.
        const followers = followerSnap.val() || {};
        followers[followerUid] = followStatus;

        // Count the non-nulls.
        let countFollowers = 0;
        Object.keys(followers).forEach(key => {
            if (followers[key]){
                countFollowers += 1;
            }
        });

        // Update DB.
        updates.followers = followers;
        updates.followerCount = countFollowers;
        return admin.database().ref(`users/${ followedUid }`).update(updates);
    });
});

// Count what the current user is following when changed.
exports.countFollowing = functions.database.ref('/following/{followerUid}/{followedUid}').onWrite(event => {
    const followerUid = event.params.followerUid;
    const followedUid = event.params.followedUid;
    const followStatus = event.data.val();
    const followingRef = event.data.ref.parent;
    const updates = {};

    return followingRef.once('value')
    .then(followingSnap => {

        const following = followingSnap.val() || {};
        following[followedUid] = followStatus;

        let countFollowing = 0;
        Object.keys(following).forEach(key => {
            if (following[key]){
                countFollowing += 1;
            }
        });
        updates.following = following;
        updates.followingCount = countFollowing;

        return admin.database().ref(`users/${ followerUid }`).update(updates);
    });
});
