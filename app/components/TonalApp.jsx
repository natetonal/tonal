import React from 'react';
import { connect } from 'react-redux';
import * as actions from 'actions';

import HeaderLoggedOut from './HeaderLoggedOut';
import ModalOverlay from './ModalOverlay';
import MenuWrapper from './MenuWrapper';
import Header from './Header';
import Tabs from './Tabs';

export const TonalApp = React.createClass({

    componentWillReceiveProps(nextProps){
        const { dispatch } = this.props;

        // clear the UI state if the route changes
        if(this.props.location.pathname !== nextProps.location.pathname){
            dispatch(actions.resetUIState());
        }
    },

    // componentDidMount(props){
    //     console.log('TonalApp.jsx: component did mount with props: ', props);
    // },

    render(){

        const { uid }  = this.props;

        if(!uid){
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
});

const mapStateToProps = (state) => {
    return {
        uid: state.auth.uid
    };
};

export default connect(mapStateToProps)(TonalApp);
