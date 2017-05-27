import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import router from '../router/';
import DevTools from './DevTools';

export default class Root extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired
    };

    render() {
        const { store } = this.props;
        return (
            <Provider store={ store }>
                <div>
                    { router }
                    <DevTools />
                </div>
            </Provider>
        );
    }
}
