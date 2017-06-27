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
