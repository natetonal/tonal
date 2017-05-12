import {
    databaseRef
} from 'app/firebase';

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

export const deletePost = postId => {
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
