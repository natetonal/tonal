import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

import LoginModal from './LoginModal/LoginModal';

export const Landing = React.createClass({

    render(){

        const { isModalOpen, location: { query }} = this.props;

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
