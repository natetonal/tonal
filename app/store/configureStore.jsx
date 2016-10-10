import * as redux from 'redux';
import thunk from 'redux-thunk';
import { reducer as form } from 'redux-form';
import { browserHistory } from 'react-router';
import { authReducer, imgUrlReducer, uiStateReducer, errorsReducer, userReducer } from 'reducers';

export var configure = (initialState = {}) => {
    var reducer = redux.combineReducers({
        form,
        auth: authReducer,
        imgUrl: imgUrlReducer,
        uiState: uiStateReducer,
        errors: errorsReducer,
        user: userReducer
    });

    // Add middleware here --
    var store = redux.createStore(reducer, initialState, redux.compose(
        redux.applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    ));

    return store;
};
