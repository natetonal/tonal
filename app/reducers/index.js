import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import authReducer from './AuthReducer';
import imgUrlReducer from './ImgUrlReducer';
import uiStateReducer from './UIStateReducer';
import userReducer from './UserReducer';
import feedReducer from './FeedReducer';
import headerComposeReducer from './HeaderComposeReducer';
import composerReducer from './ComposerReducer';
import emojiSelectorReducer from './EmojiSelectorReducer';
import giphySelectorReducer from './GiphySelectorReducer';
import routeReducer from './RouteReducer';

export default combineReducers({
    form,
    auth: authReducer,
    imgUrl: imgUrlReducer,
    uiState: uiStateReducer,
    user: userReducer,
    feed: feedReducer,
    headerCompose: headerComposeReducer,
    composer: composerReducer,
    emojiSelector: emojiSelectorReducer,
    giphySelector: giphySelectorReducer,
    route: routeReducer
});
