import React, { Component } from 'react';
import { connect } from 'react-redux';
import { resetUIState } from 'actions/UIStateActions';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import FirstTimeUserPrompt from 'prompts/firsttimeuser/FirstTimeUserPrompt';

import HeaderLoggedOut from 'header/HeaderLoggedOut';
import HeaderDummy from 'header/HeaderDummy';
import ModalOverlay from 'header/ModalOverlay';
import Header from 'header/Header';
import MenuWrapper from './MenuWrapper';
import Observer from './Observer';
import Tabs from './Tabs';


class TonalApp extends Component {

    componentWillReceiveProps(nextProps){
        const { dispatch } = this.props;

        if (this.props.location.pathname){
            console.log('from TonalApp: this.props.location.pathname? ', this.props.location.pathname);
        }
        // clear the UI state if the route changes
        if (this.props.location.pathname !== nextProps.location.pathname){
            dispatch(resetUIState());
        }
    }

    render(){

        const {
            uid,
            status,
            firstLogin,
        } = this.props;

        console.log(`TonalApp rendering with uid: ${ uid }, status: ${ status } and firstLogin: ${ firstLogin }`);

        const displayFirstTimeUserPrompt = () => {
            if (firstLogin){
                return <FirstTimeUserPrompt />;
            }

            return '';
        };

        const mainView = () => {

            // Authorized Log In:
            if (uid &&
                !firstLogin &&
                status === 'success'){
                return (
                    <MenuWrapper>
                        <Observer />
                        <Header />
                        <div className="tonal-content">
                            { this.props.children }
                        </div>
                        <Tabs />
                    </MenuWrapper>
                );

            // First Log In View With Prompt:
            } else if (uid &&
                firstLogin &&
                status === 'success'){
                return (
                    <MenuWrapper>
                        <ReactCSSTransitionGroup
                            transitionName="smooth-fadein"
                            transitionAppear
                            transitionAppearTimeout={ 200 }
                            transitionEnter={ false }
                            transitionLeave={ false }>
                            { displayFirstTimeUserPrompt() }
                        </ReactCSSTransitionGroup>
                        <div className="blur">
                            <Header />
                            <div className="tonal-content">
                                { this.props.children }
                            </div>
                            <Tabs />
                        </div>
                    </MenuWrapper>
                );

            // Loading View:
            } else if (status === 'fetching'){
                return (
                    <div>
                        <HeaderDummy />
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

            // Logged Out View:
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
}

export default connect(state => {
    return {
        uid: state.auth.uid,
        firstLogin: state.user.firstLogin,
        status: state.user.status
    };
})(TonalApp);
