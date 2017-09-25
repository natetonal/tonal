import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createBrowserHistory from 'history/createBrowserHistory';
import TonalApp from 'TonalApp';

const history = createBrowserHistory();

class Root extends Component {

    render() {
        const { store } = this.props;
        return (
            <Provider store={ store }>
                <ConnectedRouter history={ history }>
                    <TonalApp />
                </ConnectedRouter>
            </Provider>
        );
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired
};

export default Root;
