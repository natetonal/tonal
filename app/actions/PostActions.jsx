import {
    databaseRef
} from 'app/firebase';

export const writePost = data => {
    return (dispatch, getState) => {
        if (data && data.user.uid){
            const uid = data.user.uid;
            const postId = databaseRef.child('posts').push().key;
            const updates = {};

            data.postId = postId;
            console.log('data from writePost: ', data);
            updates[`/posts/${ postId }`] = data;
            updates[`/user-posts/${ uid }/${ postId }`] = data;
            updates[`/feed/${ uid }/${ postId }`] = data;
            databaseRef.update(updates);
        }
    };
};
