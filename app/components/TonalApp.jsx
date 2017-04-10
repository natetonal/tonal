import React from 'react';
import { connect } from 'react-redux';
import { resetUIState } from 'actions/UIStateActions';

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

        const { uid } = this.props;

        if (!uid){
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
        }

        return (
            <MenuWrapper>
                <Header />
                <div className="tonal-content">
                    { this.props.children }
                </div>
                <Tabs />
            </MenuWrapper>
        );

    }
});

export default connect(state => {
    return {
        uid: state.user.uid
    };
})(TonalApp);
