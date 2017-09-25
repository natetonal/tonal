// This needs to be the new router file.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Switch,
    Route
} from 'react-router-dom';
import { resetUIState } from 'actions/UIStateActions';

// Routes with Exact Paths
import Verify from 'pages/Verify';
import Landing from 'pages/Landing';
import Connect from 'pages/Connect';
import Discover from 'pages/Discover';
import MyMusic from 'pages/MyMusic';
import TonalStore from 'pages/TonalStore';
import NotFound from 'pages/NotFound';

// Conditionally Rendered Routes
import FirstTimeUserPrompt from 'prompts/firsttimeuser/FirstTimeUserPrompt'; // firstLogin === true
import HeaderLoggedOut from 'header/HeaderLoggedOut'; // !uid
import ModalOverlay from 'header/ModalOverlay'; // !uid,
import Header from 'header/Header'; // uid, status === 'success'
import MenuWrapper from './MenuWrapper'; // uid, status === 'success'
import Observer from './Observer'; // uid, status === 'success'
import Tabs from './Tabs'; // uid, status === 'success'

class TonalApp extends Component {

    componentWillReceiveProps(nextProps){
        const {
            dispatch,
            path
        } = this.props;

        // clear the UI state if the route changes
        if (path !== nextProps.path){
            dispatch(resetUIState());
        }
    }

    render(){

        const {
            uid,
            status,
            firstLogin,
        } = this.props;


        const loggedIn = uid && status === 'success';

        const ContentWrappedRoutes = routes => {
            return (
                <div className="tonal-content">
                    { routes.children }
                </div>
            );
        };

        const MenuWrappedRoutes = routes => {
            if (loggedIn){
                return (
                    <MenuWrapper>
                        { routes.children }
                    </MenuWrapper>
                );
            }

            return (
                <div className="tonal-main">
                    { routes.children }
                </div>
            );
        };

        const BlurWrappedRoutes = routes => {
            if (firstLogin){
                return (
                    <div className="blur">
                        { routes.children }
                    </div>
                );
            }

            return (
                <div>
                    { routes.children }
                </div>
            );
        };

        const LoadingRoute = ({ ...route }) => {
            if (status === 'fetching'){
                return <Route { ...route } />;
            }

            return null;
        };

        const LoggedInRoute = ({ ...route }) => {
            if (loggedIn){
                return <Route { ...route } />;
            }

            return null;
        };

        const LoggedOutRoute = ({ ...route }) => {
            if (!loggedIn){
                return <Route { ...route } />;
            }

            return null;
        };

        const NewUserRoute = props => {
            if (loggedIn && firstLogin){
                return <Route { ...props } />;
            }

            return null;
        };

        const ContentLoader = () => {
            if (status === 'fetching'){
                return (
                    <div className="tonal-content-loading">
                        <span>Loading</span>
                        <span>
                            <i className="fa fa-spinner fa-spin fa-3x fa-fw" />
                        </span>
                    </div>
                );
            }
        };

        return (
            <main>
                <MenuWrappedRoutes>
                    <NewUserRoute component={ FirstTimeUserPrompt } />
                    <BlurWrappedRoutes>
                        <LoggedInRoute component={ Observer } />
                        <LoggedInRoute component={ Header } />
                        <LoggedOutRoute component={ HeaderLoggedOut } />
                        <ContentWrappedRoutes>
                            <LoadingRoute component={ ContentLoader } />
                            <Switch>
                                <Route exact path="/" component={ Landing } />
                                <Route path="/auth" component={ Verify } />
                                <Route path="/connect" component={ Connect } />
                                <Route path="/discover" component={ Discover } />
                                <Route path="/mymusic" component={ MyMusic } />
                                <Route path="/store" component={ TonalStore } />
                                <Route component={ NotFound } />
                            </Switch>
                        </ContentWrappedRoutes>
                        <LoggedInRoute component={ Tabs } />
                    </BlurWrappedRoutes>
                </MenuWrappedRoutes>
                <LoggedOutRoute component={ ModalOverlay } />
            </main>
        );
    }
}

export default connect(state => {
    return {
        path: state.router.location.pathname,
        uid: state.auth.uid,
        firstLogin: state.user.firstLogin,
        status: state.user.status
    };
})(TonalApp);
