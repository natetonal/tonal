import React from 'react';
import { connect } from 'react-redux';
import { resetUIState } from 'actions/UIStateActions';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import HeaderLoggedOut from 'header/HeaderLoggedOut';
import ModalOverlay from 'header/ModalOverlay';
import Header from 'header/Header';
import MenuWrapper from './MenuWrapper';
import Tabs from './Tabs';


export const TonalApp = React.createClass({

    componentWillReceiveProps(nextProps){
        const { dispatch } = this.props;

        // clear the UI state if the route changes
        if (this.props.location.pathname !== nextProps.location.pathname){
            dispatch(resetUIState());
        }
    },

    render(){

        const {
            uid,
            status
        } = this.props;

        const mainView = () => {
            if (uid && status === 'success'){
                console.log('from mainView: success!');
                return (
                    <MenuWrapper>
                        <Header />
                        <div className="tonal-content">
                            { this.props.children }
                        </div>
                        <Tabs />
                    </MenuWrapper>
                );
            } else if (status === 'fetching'){
                console.log('from mainView: fetching!');
                return (
                    <div>
                        <HeaderLoggedOut />
                        <div className="tonal-main">
                            <div className="tonal-content">
                                <div className="tonal-content-loading">
                                    <span>Loading</span>
                                    <span>
                                        <i className="fa fa-spinner fa-spin fa-3x fa-fw" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            console.log('default main view!!');
            return (
                <div>
                    <HeaderLoggedOut />
                    <div className="tonal-main">
                        <div className="tonal-content">
                            { this.props.children }
                        </div>
                    </div>
                    <ModalOverlay />
                </div>
            );
        };

        return (
            <ReactCSSTransitionGroup
                transitionName="dramatic-fadein"
                transitionEnterTimeout={ 500 }
                transitionLeaveTimeout={ 500 }>
                { mainView() }
            </ReactCSSTransitionGroup>
        );
    }
});

export default connect(state => {
    return {
        uid: state.auth.uid,
        status: state.user.status
    };
})(TonalApp);
