import {
    databaseRef
} from 'app/firebase';
import moment from 'moment';

export const writePost = data => {
    return (dispatch, getState) => {
        const uid = getState().user.uid;
        const postId = databaseRef.child('posts').push().key;
        const updates = {};

        data.postId = postId;
        console.log('data from writePost: ', data);
        updates[`/posts/${ postId }`] = data;
        updates[`/user-posts/${ uid }/${ postId }`] = data;
        updates[`/feed/${ uid }/${ postId }`] = data;
        databaseRef.update(updates);
    };
};

export const updatePost = (data, postId) => {
    return (dispatch, getState) => {
        const uid = getState().user.uid;
        const updates = {};

        data.postId = postId;
        data.postEdited = true;
        data.postEditedAt = moment().calendar();
        console.log('data from updatePost: ', data);
        updates[`/posts/${ postId }`] = data;
        updates[`/user-posts/${ uid }/${ postId }`] = data;
        updates[`/feed/${ uid }/${ postId }`] = data;
        databaseRef.update(updates);
    };
};

export const deletePost = postId => {
    console.log('deletePost called with postId: ', postId);
    return (dispatch, getState) => {
        if (postId){
            const uid = getState().user.uid;
            const updates = {};
            const data = null;

            updates[`/posts/${ postId }`] = data;
            updates[`/user-posts/${ uid }/${ postId }`] = data;
            updates[`/feed/${ uid }/${ postId }`] = data;
            databaseRef.update(updates);
        }
    };
};
