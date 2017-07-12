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

exports.countLikes = (group, event, admin) => {
    const postId = event.params.postId;
    const targetId = event.params.targetId;
    const status = event.data.val() || null;
    const parentRef = event.data.ref.parent;

    // Return the promise from countRef.transaction() so our function
    // waits for this async event to complete before it exits.
    return parentRef.once('value')
    .then(snap => {

        const updates = {};
        const children = snap.val() || {};
        children[targetId] = status;

        let count = 0;
        Object.keys(children).forEach(key => {
            if (children[key]){
                count += 1;
            }
        });

        updates[`posts/${ postId }/${ group }Count`] = count;
        return admin.database().ref().update(updates);

    }).then(() => {
        console.log('Likes counter updated.');
    });
};
