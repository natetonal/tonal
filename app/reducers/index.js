import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import authReducer from './AuthReducer';
import imgUrlReducer from './ImgUrlReducer';
import uiStateReducer from './UIStateReducer';
import errorsReducer from './ErrorsReducer';
import userReducer from './UserReducer';
import headerComposeReducer from './HeaderComposeReducer';
import composerReducer from './ComposerReducer';
import emojiSelectorReducer from './EmojiSelectorReducer';
import giphySelectorReducer from './GiphySelectorReducer';
import routeReducer from './RouteReducer';
import previewLinkReducer from './PreviewLinkReducer';

export default combineReducers({
    form,
    auth: authReducer,
    imgUrl: imgUrlReducer,
    uiState: uiStateReducer,
    errors: errorsReducer,
    user: userReducer,
    headerCompose: headerComposeReducer,
    composer: composerReducer,
    emojiSelector: emojiSelectorReducer,
    giphySelector: giphySelectorReducer,
    route: routeReducer,
    previewLink: previewLinkReducer
});
