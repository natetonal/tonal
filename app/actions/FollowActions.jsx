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
                const updates = {};

                if (!currentValue){
                    const followerData = {
                        uid: user.uid,
                        username: user.username,
                        displayName: user.displayName,
                        avatar: user.avatar,
                        timeStamp: moment().format('LLLL')
                    };

                    // I click follow - I am a "follower".
                    // The user who I'm following is "followed"
                    // I need to add that user to my "followed" object.
                    // They need to add me to their "followers" object.

                    updates[`followers/${ followed }/${ follower }`] = followerData;
                    updates[`users/${ follower }/following/${ followed }`] = true;
                    updates[`users/${ followed }/followers/${ follower }`] = true;
                } else {
                    updates[`followers/${ followed }/${ follower }`] = null;
                    updates[`users/${ follower }/following/${ followed }`] = null;
                    updates[`users/${ followed }/followers/${ follower }`] = null;
                }

                return databaseRef.update(updates);

            });
        }
    };
};
