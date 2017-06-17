import { databaseRef } from 'app/firebase';
import moment from 'moment';

// Check first to see if follower is blocked by current user or follower is
// currently blocking current user (neither should be possible in UI - this is a safeguard).
// Then, add follower & following relationship to users.
export const addFollower = (followedId, username, displayName) => {
    return (dispatch, getState) => {
        const user = getState().user;
        const uid = getState().auth.uid;
        const blocked = user.blocked ? Object.keys(user.blocked).includes(followedId) : false;
        const blockedBy = user.blockedBy ? Object.keys(user.blockedBy).includes(followedId) : false;
        const isSelf = uid === followedId;

        if (!blocked && !blockedBy && !isSelf){
            const followerRef = databaseRef.child(`followers/${ followedId }/${ uid }`);
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

                    const target = {};
                    target[followedId] = {
                        uid: followedId,
                        username,
                        displayName
                    };
                    const thisUpdate = {
                        timeStamp: moment().format('LLLL'),
                        target
                    };
                    updates[`followers/${ followedId }/${ uid }`] = thisUpdate;
                    updates[`following/${ uid }/${ followedId }`] = thisUpdate;
                } else {
                    console.log('currently following user. deleting from db.');
                    updates[`followers/${ followedId }/${ uid }`] = null;
                    updates[`following/${ uid }/${ followedId }`] = null;
                    updates[`favorites/${ followedId }/${ uid }`] = null;
                    updates[`favorited/${ uid }/${ followedId }`] = null;
                }

                return databaseRef.update(updates);

            });
        } else {
            console.log('This user is currently either blocked or blocking you. Or it\'s you. No go on the friendship, buddy.');
        }
    };
};

// I click "add to favorites" - To that user, I have "favorited" them.
// The user who I've added is in my "favorites".
// I need to add that user to my "favorites" object.
// They need to add me to their "favorited" object.

// Verbiage review: By "adding to favorite", you add your "favorited" user to your "favorites" object.
// They, in turn, have you listed as "favorited", and can "unfavorite" you at will.

export const addFavorite = (favoritedId, username, displayName) => {
    return (dispatch, getState) => {
        const user = getState().user;
        const uid = getState().auth.uid;
        const blocked = user.blocked ? Object.keys(user.blocked).includes(favoritedId) : false;
        const blockedBy = user.blockedBy ? Object.keys(user.blockedBy).includes(favoritedId) : false;
        const isSelf = uid === favoritedId;

        if (!blocked && !blockedBy && !isSelf){
            const followerRef = databaseRef.child(`favorites/${ uid }/${ favoritedId }`);
            followerRef.once('value')
            .then(snapshot => {
                const currentValue = snapshot.val();
                const updates = {};

                if (!currentValue){
                    console.log('user not currently in favorites. adding to db.');


                    const target = {};
                    target[favoritedId] = {
                        uid: favoritedId,
                        username,
                        displayName
                    };

                    const thisUpdate = {
                        timeStamp: moment().format('LLLL'),
                        target
                    };

                    updates[`favorites/${ uid }/${ favoritedId }`] = thisUpdate;
                    updates[`favorited/${ favoritedId }/${ uid }`] = thisUpdate;
                } else {
                    console.log('currently favoriting user. deleting from db.');
                    updates[`favorites/${ uid }/${ favoritedId }`] = null;
                    updates[`favorited/${ favoritedId }/${ uid }`] = null;
                }

                return databaseRef.update(updates);

            });
        } else {
            console.log('There\'s no love lost here, I\'m afraid.');
        }
    };
};
