import * as redux from 'redux';
import thunk from 'redux-thunk';

import { authReducer, imgUrlReducer, uiStateReducer } from 'reducers';

export var configure = (initialState = {}) => {
    var reducer = redux.combineReducers({
        auth: authReducer,
        imgUrl: imgUrlReducer,
        uiState: uiStateReducer
    });

    // Add middleware here --
    var store = redux.createStore(reducer, initialState, redux.compose(
        redux.applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    ));

    return store;
};