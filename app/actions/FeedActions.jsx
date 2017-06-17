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

export const removeFeedPost = key => {
    return {
        type: 'FEED_REMOVE_POST',
        key
    };
};

export const toggleEditPost = (postId = false) => {
    return (dispatch, getState) => {
        const currentlyEditing = getState().feed.editing;
        if (currentlyEditing === postId){
            postId = false;
        }

        dispatch({
            type: 'FEED_EDIT_POST',
            postId
        });
    };
};

// export const removeFeedPost = ();
export const fetchFeed = uid => {
    return dispatch => {
        dispatch(updateFeedStatus('fetching'));
        databaseRef.child(`feed/${ uid }`).once('value')
        .then(snapshot => {
            const feed = snapshot.val();
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
