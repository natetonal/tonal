exports.countChildren = (groupName, event, admin, updateUserGroup = true) => {
    const userId = event.params.userId;
    const targetId = event.params.targetId;
    const status = event.data.val();
    const parentRef = event.data.ref.parent;

    return parentRef.once('value')
    .then(snap => {

        // Update this category with new information.
        const updates = {};
        const children = snap.val() || {};
        children[targetId] = status;

        // Count the non-nulls.
        let count = 0;
        Object.keys(children).forEach(key => {
            if (children[key]){
                count += 1;
            }
        });

        // Update database.
        if (updateUserGroup){
            updates[groupName] = children;
        }

        updates[`${ groupName }Count`] = count;
        return admin.database().ref(`users/${ userId }`).update(updates);
    });
};

exports.countLikes = (event, admin) => {
    const userId = event.params.userId;
    const postId = event.params.postId;
    const parentRef = event.data.ref.parent;
    const updates = {};

    // Return the promise from countRef.transaction() so our function
    // waits for this async event to complete before it exits.
    return parentRef.once('value')
    .then(snap => {

        const children = snap.val() || {};

        let count = 0;
        Object.keys(children).forEach(key => {
            if (children[key]){
                count += 1;
            }
        });

        updates[`posts/${ postId }/likesCount`] = count;
        updates[`user-posts/${ userId }/${ postId }/likesCount`] = count;
        updates[`feed/${ userId }/${ postId }/likesCount`] = count;
        return admin.database().ref().update(updates);

    }).then(() => {
        console.log('Likes counter updated.');
    });
};
