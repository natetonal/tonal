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

export const addNotif = (key = false, post = false) => {
    return {
        type: 'NOTIFS_ADD_NOTIF',
        key,
        post
    };
};

export const removeNotif = key => {
    return {
        type: 'NOTIFS_REMOVE_NOTIF',
        key
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
