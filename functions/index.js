const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.sendFollowerNotification = functions.database.ref('/followers/{followedUid}/{followerUid}').onWrite(event => {
    const followerUid = event.params.followerUid;
    const followedUid = event.params.followedUid;
    let type = 'follower-add';

    if (!event.data.val()) {
        type = 'follower-remove';
        return console.log('User ', followerUid, 'un-followed user', followedUid);
    }

    const {
        uid,
        username,
        displayName,
        avatar,
        timeStamp
    } = event.data.val();

    const notifId = admin.database().ref(`/notifications/${ followedUid }/`).push().key;

    return admin.database().ref(`/notifications/${ followedUid }/${ notifId }`)
    .update({
        type,
        uid,
        username,
        displayName,
        avatar,
        timeStamp,
        acknowledged: false,
        clicked: false
    });
});
