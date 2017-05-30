import { databaseRef } from 'app/firebase';
import moment from 'moment';

export const addFollower = (follower, followed) => {
    return (dispatch, getState) => {
        const user = getState().user;
        const blocked = user.blocked ? Object.keys(user.blocked).includes(follower) : false;
        if (!blocked){
            const followerRef = databaseRef.child(`followers/${ followed }/${ follower }`);
            followerRef.once('value')
            .then(snapshot => {
                const currentValue = snapshot.val();

                if (!currentValue){
                    const {
                        uid,
                        username,
                        displayName,
                        avatar
                    } = user;

                    return databaseRef.child(`followers/${ followed }/${ follower }`).update({
                        uid,
                        username,
                        displayName,
                        avatar,
                        timeStamp: moment().format('LLLL')
                    });
                }

                return databaseRef.child(`followers/${ followed }/${ follower }`).remove();

            });
        }
    };
};
