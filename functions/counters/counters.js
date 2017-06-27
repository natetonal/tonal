const counterUtils = require('./counterUtils.js');

// Count user's followers when changed.
exports.countFollowers = (functions, admin) => {
    return functions.database.ref('/followers/{userId}/{targetId}')
        .onWrite(event => counterUtils.countChildren('followers', event, admin));
};

// Count user's following when changed.
exports.countFollowing = (functions, admin) => {
    return functions.database.ref('/following/{userId}/{targetId}')
        .onWrite(event => counterUtils.countChildren('following', event, admin));
};

// Count user's favorites when changed.
exports.countFavorites = (functions, admin) => {
    return functions.database.ref('/favorites/{userId}/{targetId}')
        .onWrite(event => counterUtils.countChildren('favorites', event, admin));
};

// Count user's favorited when changed.
exports.countFavorited = (functions, admin) => {
    return functions.database.ref('/favorited/{userId}/{targetId}')
        .onWrite(event => counterUtils.countChildren('favorited', event, admin));
};

exports.countUserPosts = (functions, admin) => {
    return functions.database.ref('/user-posts/{userId}/{postId}')
        .onWrite(event => counterUtils.countChildren('post', event, admin, false));
};

exports.countPostLikes = (functions, admin) => {
    return functions.database.ref('/user-posts/{userId}/{postId}/likes/{targetId}')
        .onWrite(event => counterUtils.countLikes('likes', event, admin));
};
