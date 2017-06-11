exports.countChildren = (groupName, event, admin) => {
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
        updates[groupName] = children;
        updates[`${ groupName }Count`] = count;
        return admin.database().ref(`users/${ userId }`).update(updates);
    });
};
