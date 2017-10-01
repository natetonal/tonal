import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import history from 'app/tonalHistory';
import TonalApp from 'TonalApp';
import DevTools from './DevTools';

//
class Root extends Component {

    render() {

        const { store } = this.props;
        return (
            <Provider store={ store }>
                <div>
                    <ConnectedRouter history={ history }>
                        <TonalApp />
                    </ConnectedRouter>
                    <DevTools />
                </div>
            </Provider>
        );
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired
};

export default Root;
