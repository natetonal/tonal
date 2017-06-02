import { databaseRef } from 'app/firebase';
import { updateUserData } from 'actions/UserActions';
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
                    console.log('not currently following user. adding to db.');

                    // I click follow - I am a "follower".
                    // The user who I'm following is "followed"
                    // I need to add that user to my "followed" object.
                    // They need to add me to their "followers" object.

                    updates[`followers/${ followed }/${ follower }`] = moment().format('LLLL');
                    updates[`following/${ follower }/${ followed }`] = moment().format('LLLL');
                } else {
                    console.log('currently following user. deleting from db.');
                    updates[`followers/${ followed }/${ follower }`] = null;
                    updates[`following/${ follower }/${ followed }`] = null;
                }

                return databaseRef.update(updates);

            });
        }
    };
};
