import {
    databaseRef
} from 'app/firebase';
import moment from 'moment';
import { updateUserData } from 'actions/UserActions';

export const writePost = data => {
    return (dispatch, getState) => {
        const uid = getState().user.uid;
        const postId = databaseRef.child('posts').push().key;
        const updates = {};

        data.postId = postId;
        updates[`/posts/${ postId }`] = data;
        updates[`/user-posts/${ uid }/${ postId }`] = data;
        updates[`/feed/${ uid }/${ postId }`] = data;
        databaseRef.update(updates);

        databaseRef.child(`user-activity/${ uid }/${ postId }`).update({
            type: 'post-add',
            timeStamp: moment().format('LLLL')
        });

        dispatch(updateUserData({
            postCount: getState().user.postCount + 1
        }));
    };
};

export const updatePost = (data, postId) => {
    return (dispatch, getState) => {
        const uid = getState().user.uid;
        const updates = {};

        data.postId = postId;
        data.postEdited = true;
        data.postEditedAt = moment().calendar();
        updates[`/posts/${ postId }`] = data;
        updates[`/user-posts/${ uid }/${ postId }`] = data;
        updates[`/feed/${ uid }/${ postId }`] = data;
        databaseRef.update(updates);

        databaseRef.child(`user-activity/${ uid }/${ postId }`).update({
            type: 'post-update',
            timeStamp: moment().format('LLLL')
        });
    };
};

export const deletePost = postId => {
    return (dispatch, getState) => {
        if (postId){
            const uid = getState().user.uid;
            const updates = {};
            const data = null;

            updates[`/posts/${ postId }`] = data;
            updates[`/user-posts/${ uid }/${ postId }`] = data;
            updates[`/feed/${ uid }/${ postId }`] = data;
            updates[`user-activity/${ uid }/${ postId }`] = data;
            databaseRef.update(updates);

            dispatch(updateUserData({
                postCount: getState().user.postCount - 1
            }));
        }
    };
};
