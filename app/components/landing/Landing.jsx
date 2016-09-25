import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

import LoginModal from './LoginModal/LoginModal';

export const Landing = React.createClass({

    handleQuery(query){
        const { dispatch } = this.props;
        const { mode, oobCode } = query;
        if(mode == 'verifyEmail' && oobCode){
            console.log('from Landing: all needs are met to dispatch verifyEmail action!');
            return dispatch(actions.verifyEmail(oobCode));
        }
    },

    render(){

        const { isModalOpen, location: { query }} = this.props;

        if(query){
            this.handleQuery(query);
        }

        console.log("query from Landing.jsx: ", query);

        return(
            <div>
                <LoginModal />
                <div className={`auth-content ${ isModalOpen ? "blur" : "" }`}>
                    <div className="landing-section section-1">
                    </div>
                </div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return { isOpen: state.uiState.loginModalIsOpen };
})(Landing);
