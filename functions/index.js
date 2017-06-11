const functions = require('firebase-functions');
const admin = require('firebase-admin');


admin.initializeApp(functions.config().firebase);

// Main Imports
const notifs = require('./notifs/notifs.js');
const counters = require('./counters/counters.js');
const feeds = require('./feeds/feeds.js');

// Utility Imports
const notifUtils = require('./notifs/notifUtils.js');

// Notification Functions
exports.sendFollowerNotification = notifs.sendFollowerNotification(functions, admin);
exports.sendFavoritedNotification = notifs.sendFavoritedNotification(functions, admin);
exports.sendPostNotification = notifs.sendPostNotification(functions, admin);
exports.updateNotifications = notifUtils.updateNotifications(functions);
exports.deleteBlockedNotifs = notifUtils.deleteBlockedNotifs(functions, admin);

// Counting Functions
exports.countFollowers = counters.countFollowers(functions, admin);
exports.countFollowing = counters.countFollowing(functions, admin);
exports.countFavorites = counters.countFavorites(functions, admin);
exports.countFavorited = counters.countFavorited(functions, admin);

// Feed Functions
exports.updateUserFeeds = feeds.updateUserFeeds(functions, admin);
