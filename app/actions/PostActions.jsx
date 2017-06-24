import {
    databaseRef
} from 'app/firebase';
import moment from 'moment';

export const writePost = data => {
    return (dispatch, getState) => {
        const uid = getState().auth.uid;
        const postId = databaseRef.child('posts').push().key;
        const updates = {};

        data.postId = postId;
        data.timeStamp = moment().format('LLLL');
        updates[`/posts/${ postId }`] = data;
        updates[`/user-posts/${ uid }/${ postId }`] = data;
        updates[`/users/${ uid }/recentPost`] = data;
        updates[`/feed/${ uid }/${ postId }`] = data;
        databaseRef.update(updates);
    };
};

export const updatePost = (data, postId) => {
    return () => {
        const uid = data.author.uid;
        const updates = {};

        data.postId = postId;
        data.postEdited = true;
        data.postEditedAt = moment().format('LLLL');
        updates[`/posts/${ postId }`] = data;
        updates[`/user-posts/${ uid }/${ postId }`] = data;
        updates[`/users/${ uid }/recentPost`] = data;
        updates[`/feed/${ uid }/${ postId }`] = data;
        databaseRef.update(updates);
    };
};

export const deletePost = postId => {
    return (dispatch, getState) => {
        if (postId){
            const uid = getState().auth.uid;
            const updates = {};
            const data = null;

            updates[`/posts/${ postId }`] = data;
            updates[`/user-posts/${ uid }/${ postId }`] = data;
            updates[`/feed/${ uid }/${ postId }`] = data;
            updates[`user-activity/${ uid }/${ postId }`] = data;
            databaseRef.update(updates);
        }
    };
};

export const likePost = (postId, likeId, liked) => {
    return (dispatch, getState) => {
        if (postId){
            const uid = getState().auth.uid;
            const updates = {};
            let data = moment().format('LLLL');

            if (!liked){
                data = null;
            }

            console.log('likePost: liked data: ', liked);
            updates[`posts/${ postId }/likes/${ likeId }`] = data;
            updates[`feed/${ uid }/${ postId }/likes/${ likeId }`] = data;
            updates[`user-activity/${ uid }/${ postId }/likes/${ likeId }`] = data;
            databaseRef.update(updates);

        }
    };
};

export const updatePostAuthorData = (data, postId) => {
    return dispatch => {
        const author = data.author;
        if (!author){ return; }

        databaseRef.child(`users/${ author.uid }`).once('value')
        .then(snapshot => {
            const newAuthor = snapshot.val();
            if (!newAuthor ||
                Object.keys(author).every(key => author[key] === newAuthor[key])){ return; }

            data.author.displayName = newAuthor.displayName;
            data.author.avatar = newAuthor.avatar;

            dispatch(updatePost(data, postId));
        });
    };
};
