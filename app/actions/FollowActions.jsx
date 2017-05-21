import { databaseRef } from 'app/firebase';
import moment from 'moment';

export const addFollower = (follower, followed) => {
    return (dispatch, getState) => {
        const user = getState().user;
        const {
            uid,
            username,
            displayName,
            avatar
        } = user;

        databaseRef.child(`followers/${ followed }/${ follower }`).update({
            uid,
            username,
            displayName,
            avatar,
            timeStamp: moment().format('LLLL')
        });
    };
};
