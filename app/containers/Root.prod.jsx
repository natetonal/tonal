import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import router from '../router/';

class Root extends Component {

    render() {
        const { store } = this.props;
        return (
            <Provider store={ store }>
                <div>
                    {router}
                </div>
            </Provider>
        );
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired
};

export default Root;
