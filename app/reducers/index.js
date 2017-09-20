import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as form } from 'redux-form';

import authReducer from './AuthReducer';
import storageReducer from './StorageReducer';
import uiStateReducer from './UIStateReducer';
import userReducer from './UserReducer';
import feedsReducer from './FeedsReducer';
import notifsReducer from './NotificationReducer';
import followReducer from './FollowReducer';
import headerComposeReducer from './HeaderComposeReducer';
import composerReducer from './ComposerReducer';
import emojiSelectorReducer from './EmojiSelectorReducer';
import giphySelectorReducer from './GiphySelectorReducer';
import routeReducer from './RouteReducer';

export default combineReducers({
    form,
    auth: authReducer,
    storage: storageReducer,
    uiState: uiStateReducer,
    user: userReducer,
    feeds: feedsReducer,
    notifs: notifsReducer,
    follow: followReducer,
    headerCompose: headerComposeReducer,
    composer: composerReducer,
    emojiSelector: emojiSelectorReducer,
    giphySelector: giphySelectorReducer,
    route: routeReducer,
    router: routerReducer
});
