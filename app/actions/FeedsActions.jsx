import { databaseRef } from 'app/firebase';

export const updateFeedStatus = (feedId, status) => {
    return {
        type: 'FEED_UPDATE_STATUS',
        feedId,
        status
    };
};

export const addFeedData = (feedId, feedType, data = false) => {
    return {
        type: 'FEED_ADD_DATA',
        feedId,
        feedType,
        data
    };
};

export const addFeedPost = (feedId, postId = false, data = false) => {
    return {
        type: 'FEED_ADD_POST',
        feedId,
        postId,
        data
    };
};

export const updateFeedPost = (feedId, postId = false, data = false) => {
    return {
        type: 'FEED_UPDATE_POST',
        feedId,
        postId,
        data
    };
};

export const removeFeedPost = (feedId, postId) => {
    return {
        type: 'FEED_REMOVE_POST',
        feedId,
        postId
    };
};

export const toggleEditPost = (postId = false) => {
    return (dispatch, getState) => {
        const currentlyEditing = getState().feeds.editing;
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
export const fetchFeed = (feedId, type) => {
    return dispatch => {
        dispatch(updateFeedStatus(feedId, 'fetching'));
        databaseRef.child(`${ type }/${ feedId }`).once('value')
        .then(snapshot => {
            const data = snapshot.val();
            if (data){
                dispatch(addFeedData(feedId, type, data));
            } else {
                dispatch(addFeedData(feedId, type));
            }
            dispatch(updateFeedStatus(feedId, 'success'));
        }, error => {
            dispatch(updateFeedStatus(feedId, 'error'));
        });
    };
};
