import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';

import history from 'app/tonalHistory';

import thunk from 'redux-thunk';
import reducer from 'reducers';
import DevTools from '../containers/DevTools';

// Build the middleware for intercepting and dispatching navigation actions
const routerReduxMiddleware = routerMiddleware(history);

const enhancer = compose(
    // Middleware you want to use in development:
    applyMiddleware(thunk),
    applyMiddleware(routerReduxMiddleware),
    // Required! Enable Redux DevTools with the monitors you chose
    DevTools.instrument()
);

const enhancerProd = compose(
    // Middleware you want to use in production:
    applyMiddleware(thunk),
    applyMiddleware(routerReduxMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
);

export default function configure(initialState) {
    // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
    // See https://github.com/rackt/redux/releases/tag/v3.1.0
    const isDev = process.env.NODE_ENV === 'development';
    const store = createStore(reducer, initialState,
        isDev ? enhancer : enhancerProd);

    // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
    if (module.hot && isDev) {
        module.hot.accept('reducers', () =>
            store.replaceReducer(require('reducers'))
        );
    }

    return store;
}
