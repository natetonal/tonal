import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import { reducer as form } from 'redux-form';
import {
    authReducer,
    imgUrlReducer,
    uiStateReducer,
    errorsReducer,
    userReducer,
    emojiSelectorReducer,
    giphySelectorReducer,
    composerReducer,
    headerComposeReducer
} from 'reducers';
import DevTools from '../containers/DevTools';

const enhancer = compose(
    // Middleware you want to use in development:
    applyMiddleware(thunk),
    // Required! Enable Redux DevTools with the monitors you chose
    DevTools.instrument()
);

const enhancerProd = compose(
    // Middleware you want to use in development:
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
);

const reducer = combineReducers({
    form,
    auth: authReducer,
    imgUrl: imgUrlReducer,
    uiState: uiStateReducer,
    errors: errorsReducer,
    user: userReducer,
    headerCompose: headerComposeReducer,
    composer: composerReducer,
    emojiSelector: emojiSelectorReducer,
    giphySelector: giphySelectorReducer
});

export default function configure(initialState) {
    // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
    // See https://github.com/rackt/redux/releases/tag/v3.1.0
    const isDev = process.env.NODE_ENV === 'development';
    const store = createStore(reducer, initialState,
        isDev ? enhancer : enhancerProd);

    // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
    if (module.hot && isDev) {
        module.hot.accept('reducers', () =>
        store.replaceReducer(require('reducers')));
    }

    return store;
}
