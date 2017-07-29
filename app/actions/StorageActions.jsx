import firebase from 'firebase';
import { storageRef } from 'app/firebase';
import moment from 'moment';

const createUniqueName = () => {
    let name = '';
    const date = moment().format('x');
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 26; i++) {
        name += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return `${ date }_${ name }`;
};

const updateImageUploadProgress = progress => {
    return {
        type: 'STORAGE_UPDATE_UPLOAD_PROGRESS',
        progress
    };
};

const updateImageUploadState = state => {
    return {
        type: 'STORAGE_UPDATE_UPLOAD_STATE',
        state
    };
};

export const uploadPostImage = post => {
    return (dispatch, getState) => {

        const uid = getState().auth.uid;
        const name = createUniqueName();
        const file = post.file;
        const type = post.file.type.substr(6);
        console.log('file received by uploadPostImage: ', file);
        console.log('type: ', type);
        const postRef = storageRef.child(`post-images/${ uid }/${ name }.${ type }`);
        const uploadTask = postRef.put(file);
        dispatch(updateImageUploadState('running'));
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', snapshot => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log('progress from uploadPostImage: ', progress);
            dispatch(updateImageUploadProgress(progress));
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED:
                    dispatch(updateImageUploadState('paused'));
                    break;
                case firebase.storage.TaskState.RUNNING:
                    dispatch(updateImageUploadState('running'));
                    break;
                default:
                    return false;
            }
        });

        return uploadTask.then(snapshot => {
            post.image = snapshot.downloadURL;
            dispatch(updateImageUploadState(false));
            return post;
        }).catch(error => {
            return error;
        });

    };
};
