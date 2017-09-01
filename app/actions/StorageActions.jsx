import firebase from 'firebase';
import moment from 'moment';
import {
    storageRef,
    databaseRef
} from 'app/firebase';

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
        const key = databaseRef.child(`user-images/${ uid }/`).push().key;
        const file = post.file;
        const type = post.file.type.substr(6);
        console.log('file received by uploadPostImage: ', file);
        console.log('type: ', type);
        const postRef = storageRef.child(`post-images/${ uid }/${ key }.${ type }`);
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
            console.log('from uploadTask.then: snapshot.val(): ', snapshot);
            console.log('from uploadTask.then: metadata: ', snapshot.metadata);
            console.log('from uploadTask.then: downloadURL: ', snapshot.downloadURL);
            const imageData = {
                ownerId: uid,
                imageId: key,
                imageType: 'post-image',
                name: snapshot.metadata.name,
                contentType: snapshot.metadata.contentType,
                size: snapshot.metadata.size,
                url: snapshot.downloadURL,
                albums: false,
                caption: false,
                fullPath: snapshot.metadata.fullPath,
                uploadedAt: moment().format('LLLL')
            };

            console.log('imageData: ', imageData);
            post.image = imageData;
            console.log('post after data added: ', post);
            databaseRef.child(`user-images/${ uid }/${ key }`).update(imageData);
            dispatch(updateImageUploadState(false));
            return post;
        }).catch(error => {
            return error;
        });

    };
};
