import { databaseRef } from 'app/firebase';

export const fetchPreviewData = previewId => {
    return () => {
        return databaseRef.child(`users/${ previewId }`).once('value')
        .then(snapshot => {
            const user = snapshot.val();
            if (!user){ return false; }

            return user;
        });
    };
};

export const toggleListeners = (previewId, groupArr, shutOff = false) => {

    groupArr.forEach(group => {
        const thisRef = databaseRef.child(`users/${ previewId }/${ group }`);
        ['child_added', 'child_changed', 'child_removed'].forEach(event => {
            thisRef.on(event, () => {
                fetchPreviewData
            })
        })
    })
    // Observer for user's followers:
    const followersCountRef = databaseRef.child(`users/${ previewId }/${ group }`);
    followersCountRef.on('child_added', () => {
        dispatch(syncUserData(['followers', 'followersCount']));
    });
    followersCountRef.on('child_changed', () => {
        dispatch(syncUserData(['followers', 'followersCount']));
    });
    followersCountRef.on('child_removed', () => {
        dispatch(syncUserData(['followers', 'followersCount']));
    });

    // Observer for user's followings:
    const followingCountRef = databaseRef.child(`users/${ uid }/following`);
    followingCountRef.on('child_added', () => {
        dispatch(syncUserData(['following', 'followingCount']));
    });
    followingCountRef.on('child_changed', () => {
        dispatch(syncUserData(['following', 'followingCount']));
    });
    followingCountRef.on('child_removed', () => {
        dispatch(syncUserData(['following', 'followingCount']));
    });

    // Observer for user's favorites:
    const favoritesRef = databaseRef.child(`users/${ uid }/favorites`);
    favoritesRef.on('child_added', () => {
        dispatch(syncUserData(['favorites', 'favoritesCount']));
    });
    favoritesRef.on('child_changed', () => {
        dispatch(syncUserData(['favorites', 'favoritesCount']));
    });
    favoritesRef.on('child_removed', () => {
        dispatch(syncUserData(['favorites', 'favoritesCount']));
    });

    // Observer for user's favorited:
    const favoritedRef = databaseRef.child(`users/${ uid }/favorited`);
    favoritedRef.on('child_added', () => {
        dispatch(syncUserData(['favorited', 'favoritedCount']));
    });
    favoritedRef.on('child_changed', () => {
        dispatch(syncUserData(['favorited', 'favoritedCount']));
    });
    favoritedRef.on('child_removed', () => {
        dispatch(syncUserData(['favorited', 'favoritedCount']));
    });
}
