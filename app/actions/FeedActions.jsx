import { databaseRef } from 'app/firebase';

export const updateFeedStatus = status => {
    return {
        type: 'FEED_UPDATE_STATUS',
        status
    };
};

export const addFeedData = (data = false) => {
    return {
        type: 'FEED_ADD_DATA',
        data
    };
};

export const addFeedPost = (key = false, post = false) => {
    return {
        type: 'FEED_ADD_POST',
        key,
        post
    };
};

export const fetchFeed = uid => {
    return dispatch => {
        dispatch(updateFeedStatus('fetching'));
        databaseRef.child(`feed/${ uid }`).once('value')
        .then(snapshot => {
            const feed = snapshot.val();
            console.log('feed from our database: ', feed);
            if (feed){
                dispatch(addFeedData(feed));
            } else {
                dispatch(addFeedData());
            }
            dispatch(updateFeedStatus('success'));
        }, error => {
            console.log('feed fetch error! ', error);
            dispatch(updateFeedStatus('error'));
        });
    };
};
