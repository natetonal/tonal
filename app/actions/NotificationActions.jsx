import { databaseRef } from 'app/firebase';

export const updateNotifsStatus = status => {
    return {
        type: 'NOTIFS_UPDATE_STATUS',
        status
    };
};

export const addNotifData = (data = false) => {
    return {
        type: 'NOTIFS_ADD_DATA',
        data
    };
};

export const countNewNotifs = (newNotifsCount = 0) => {
    return {
        type: 'NOTIFS_COUNT_NEW_NOTIFS',
        newNotifsCount
    };
};

export const addNotifToList = (key = false, post = false) => {
    return {
        type: 'NOTIFS_ADD_NOTIF_TO_LIST',
        key,
        post
    };
};

export const removeNotifFromList = key => {
    return {
        type: 'NOTIFS_REMOVE_NOTIF_FROM_LIST',
        key
    };
};

export const deleteNotif = notifId => {
    return (dispatch, getState) => {
        if (notifId){
            const uid = getState().auth.uid;
            const updates = {};

            updates[`/notifications/${ uid }/${ notifId }`] = null;
            databaseRef.update(updates);
        }
    };
};

export const acknowledgeNotifs = notifs => {
    return (dispatch, getState) => {
        const uid = getState().auth.uid;
        databaseRef.child(`notifications/${ uid }`).once('value')
        .then(snapshot => {
            const dbNotifs = snapshot.val();

            if (dbNotifs){
                const updatedNotifs = {};

                Object.keys(dbNotifs).forEach(key => {
                    if (notifs[key] && dbNotifs[key]){
                        updatedNotifs[key] = {
                            ...dbNotifs[key],
                            acknowledged: true
                        };
                    } else {
                        updatedNotifs[key] = dbNotifs[key];
                    }
                });

                console.log('from acknowledgeNotifs: updatedNotifs: ', updatedNotifs);
                databaseRef.child(`notifications/${ uid }`).update(updatedNotifs);
            }
        });
    };
};

export const fetchNotifs = uid => {
    return dispatch => {
        dispatch(updateNotifsStatus('fetching'));
        databaseRef.child(`notifications/${ uid }`).once('value')
        .then(snapshot => {
            const notifs = snapshot.val();
            if (notifs){
                dispatch(addNotifData(notifs));
            } else {
                dispatch(addNotifData());
            }
            dispatch(updateNotifsStatus('success'));
        }, error => {
            console.log('notifs fetch error! ', error);
            dispatch(updateNotifsStatus('error'));
        });
    };
};
