const notifConsts = require('./notifConsts.js');

// sendNotif() will be the main workhorse for dispatching notifs on incoming writes.
// {
//     senderId
//     type,
//     timeStamp,
//     checkKeys, by default, make sure no one is blocked: { blocked: false, blockedBy: false }, or custom obj.
//     receivingIds = false or ['id1', 'id2']
//     receivingGroups: false or ['group1', 'group2'],
//     targets: object received by write with each target's uid, username, and displayName.
//     sendBack: t/f
// }

exports.sendNotif = ({
    senderId,
    type,
    timeStamp,
    checkKeys = false,
    receivingIds = false,
    receivingGroups = false,
    targets = false,
    sendBack = false,
    admin
}) => {

    // Dont bother if mandatory info is missing.
    if (!senderId || !type || !timeStamp || (!receivingIds && !receivingGroups)){ return; }

    // Look up the sender's most recent info.
    return admin.database().ref(`users/${ senderId }`)
    .once('value')
    .then(senderSnap => {
        const sender = senderSnap.val();

        // Make sure sender wasn't somehow deleted between dispatch and now (???)
        if (!sender){ return; }

        // Set a senders object for this notif:
        const senders = {};

        senders[sender.uid] = {
            uid: sender.uid,
            username: sender.username,
            displayName: sender.displayName
        };

        // Create notif object.
        const notif = {
            type,
            timeStamp,
            senders,
            avatar: sender.avatar,
            acknowledged: false,
            approved: false
        };

        // By default, don't send if blocked either way. Overwrite defaults if needed.
        const checkSenderKeys = { blocked: false, blockedBy: false };
        if (checkKeys){
            Object.keys(checkKeys).forEach(key => {
                checkSenderKeys[key] = checkKeys[key];
            });
        }

        // Checks id against sender's checks to make sure notif should be sent to this user.
        const checked = id => {
            if (!id){ return false; }

            return Object.keys(checkSenderKeys).every(key => {
                const thisCheck = typeof sender[key] === 'object' ? Object.keys(sender[key]).includes(id) : false;
                return thisCheck === checkSenderKeys[key];
            });
        };

        // createUpdates function accepts a notif and performs all required checks before returning update object.
        const createUpdates = newNotif => {
            const updates = {};
            let notifId = null;

            // Adds this update to id's notifications.
            // Make sure this notif has the same key for each user (makes overriding duplicates easier)
            const updateForId = (id, update) => {
                if (id && !(id === undefined)){
                    console.log(`updateForId called with ${ id } and ${ update }`);
                    notifId = notifId || admin.database().ref(`notifications/${ id }/`).push().key;
                    updates[`notifications/${ id }/${ notifId }`] = update;
                }
            };

            // If notif has targets, filter out bad ones and add that data to all outgoing notifs.
            if (targets){

                const targetsObj = {};
                const filteredTargets = Object.keys(targets).filter(targetKey => {
                    return checked(targetKey) &&
                        targets[targetKey].displayName &&
                        targets[targetKey].username;
                });

                console.log('filteredTargets: ', filteredTargets);

                filteredTargets.forEach(targetKey => {
                    targetsObj[targetKey] = targets[targetKey];
                });

                newNotif.targets = targetsObj;

                console.log('newNotif after filteredTargets: ', newNotif);

                filteredTargets.forEach(targetKey => {
                    updateForId(targetKey, newNotif);
                });
            }

            // Check if there are specific ids of receivers and send to checked ones.
            if (receivingIds){
                receivingIds.forEach(receivingId => {
                    if (checked(receivingId)){
                        updateForId(receivingId, newNotif);
                    }
                });
            }

            // Check if there's a group or groups that should receive this notif as well.
            if (receivingGroups){
                // If so, iterate over group keys:
                receivingGroups.forEach(groupKey => {
                    const thisGroup = typeof sender[groupKey] === 'object' ? sender[groupKey] : false;
                    // If sender has anyone in this group, iterate over its users.
                    if (thisGroup){
                        Object.keys(thisGroup).forEach(receivingId => {
                            // If so, add this user to the notifs stack.
                            if (checked(receivingId)){
                                updateForId(receivingId, newNotif);
                            }
                        });
                    }
                });
            }

            // If sender should receive a a notif back, then add it to the stack.
            if (sendBack){
                updateForId(senderId, newNotif);
            }

            console.log('updated to be returned from createUpdates: ', updates);
            return updates;
        };

        console.log('sendNOtif called with notif: ', notif);
        const updates = createUpdates(notif);

        console.log('updates sent by sendNotif: ', updates);
        return admin.database().ref().update(updates);
    });
};

// Trim, delete, and group notifications if needed.
// Also, check user settings to determine if it should even be displayed.
exports.updateNotifications = functions => {
    return functions.database.ref('/notifications/{userId}/{notifId}').onWrite(event => {

        // User just deleted a notification - no need for updates.
        if (!event.data.val()){
            return;
        }

        const notif = event.data.val();
        const notifId = event.params.notifId;
        const notifsRef = event.data.ref.parent;
        const type = notif.type;
        const senders = typeof notif.senders === 'object' ? notif.senders : {};
        const targets = typeof notif.targets === 'object' ? notif.targets : {};
        const senderKeys = Object.keys(senders);
        const targetKeys = Object.keys(targets);
        const senderCount = senderKeys.length;
        const targetCount = targetKeys.length;
        const updates = {};

        return notifsRef.once('value')
        .then(snapshot => {

            const currentNotifs = snapshot.val();
            if (currentNotifs){
            // Iterate through existing notifs. If they should be grouped, group them.
            // Otherwise, get rid of them.
                Object.keys(currentNotifs).forEach(key => {
                    const thisNotif = currentNotifs[key];
                    const thisType = thisNotif.type;
                    const thisSenders = typeof thisNotif.senders === 'object' ? thisNotif.senders : {};
                    const thisTargets = typeof thisNotif.targets === 'object' ? thisNotif.targets : {};
                    const thisSenderKeys = Object.keys(thisSenders);
                    const thisTargetKeys = Object.keys(thisTargets);
                    const thisSenderCount = thisSenderKeys.length;
                    const thisTargetCount = thisTargetKeys.length;

                    // If the incoming notif has the same type as this notif and this notif hasn't been acknowleged yet:
                    if (type === thisType){

                        // If the sender is the same, update targets and delete the old notif.
                        if (senderCount === 1 &&
                            thisSenderCount === 1 &&
                            senders[senderKeys[0]].uid === thisSenders[thisSenderKeys[0]].uid){

                            // Only update if this target is not already in there.
                            thisTargetKeys.forEach(targetKey => {
                                if (!targetKeys.includes(targetKey)){
                                    notif.targets[targetKey] = thisTargets[targetKey];
                                }
                            });

                            updates[key] = null;
                        }

                            // If the target is the same, update senders and delete the old notif.
                        if (targetCount === 1 &&
                            thisTargetCount === 1 &&
                            targets[targetKeys[0]].uid === thisTargets[thisTargetKeys[0]].uid){

                            // Only update if this sender is not already in there.
                            thisSenderKeys.forEach(senderKey => {
                                if (!senderKeys.includes(senderKey)){
                                    notif.senders[senderKey] = thisSenders[senderKey];
                                }
                            });

                            updates[key] = null;
                        }
                    }
                });
            }

            // Limit notifications to MAX_NOTIFICATIONS.
            if (snapshot.numChildren() >= notifConsts.MAX_NOTIFICATIONS) {
                let childCount = 0;
                snapshot.forEach(child => {
                    if (++childCount <= snapshot.numChildren() - notifConsts.MAX_NOTIFICATIONS) {
                        updates[child.key] = null;
                    }
                });
            }

            // This notif has been approved, we can display it.
            notif.approved = true;
            updates[notifId] = notif;

            console.log('updates made by updateNotifications: ', updates);
            // Update this user's notifications.
            return notifsRef.update(updates);
        });
    });
};

// Delete all current notifications for both users if one user blocks another.
exports.deleteBlockedNotifs = (functions, admin) => {
    return functions.database.ref('/users/{userUid}/blocked/{blockedUid}').onWrite(event => {
        const userUid = event.params.userUid;
        const blockedUid = event.params.blockedUid;
        const userNotifsRef = admin.database().ref(`notifications/${ userUid }`);
        const blockedUserNotifsRef = admin.database().ref(`notifications/${ blockedUid }`);
        const updates = {};

        return userNotifsRef.once('value')
        .then(userNotifSnapshot => {
            const userNotifs = userNotifSnapshot.val() || {};
            Object.keys(userNotifs).forEach(key => {
                if (userNotifs[key].uid === blockedUid){
                    userNotifs[key] = null;
                }
            });

            return blockedUserNotifsRef.once('value')
            .then(blockedUserNotifSnapshot => {
                const blockedUserNotifs = blockedUserNotifSnapshot.val() || {};
                Object.keys(blockedUserNotifs).forEach(key => {
                    if (blockedUserNotifs[key].uid === userUid){
                        blockedUserNotifs[key] = null;
                    }
                });

                updates[`notifications/${ userUid }`] = userNotifs;
                updates[`notifications/${ blockedUid }`] = blockedUserNotifs;

                return admin.database().ref().update(updates);
            });
        });
    });
};
