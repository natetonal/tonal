import React from 'react';
import * as Redux from 'react-redux';
import { Link } from 'react-router';
import * as actions from 'actions';
import Hammer from 'react-hammerjs';


import HeaderLoggedOut from './HeaderLoggedOut';
import ModalOverlay from './ModalOverlay';
import MenuWrapper from './MenuWrapper';
import Header from './Header';
import Tabs from './Tabs';

export const TonalApp = React.createClass({

    render(){

        const { uid }  = this.props.auth;

        // Flip this to switch between headers:
        if(uid){
            return(
                <MenuWrapper>
                    <Header />
                    <div className="tonal-content">
                        { this.props.children }
                    </div>
                    <Tabs />
                </MenuWrapper>
            );
        }

        return(
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
    }
});

export default Redux.connect(state => {
    return {
        auth: state.auth
    };
})(TonalApp);
