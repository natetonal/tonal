import React from 'react';
import { Link } from 'react-router';
import * as Redux from 'react-redux';
import * as actions from 'actions';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Login from './Login';
import Signup from './Signup';

export const LoginModal = React.createClass({

    handleTabs(event){
        event.preventDefault();
        const tabSelected = event.target.getAttribute('name')
        const { dispatch } = this.props;
        dispatch(actions.toggleLoginModalTab(tabSelected));
    },

    render(){

        const { isOpen, tabSelected } = this.props;

        return(
            <div className={`md-modal md-effect-1 ${isOpen ? "md-show" : ""}`} id="modal-1">
            	<div className="md-content">
            		<div className="login-area">
                        <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={250} transitionLeaveTimeout={1}>
                            { tabSelected === 'login' ? <Login key="login" /> : <Signup key="signup" /> }
                        </ReactCSSTransitionGroup>
            		</div>
                    <div className="login-tabs">
                        <div className={`login-tab ${tabSelected === 'signup' ? 'selected' : ''} `}>
                            <Link name="signup"
                                  to="#"
                                  onClick={this.handleTabs}
                                  className="login-tabs-label">Sign Up</Link>
                        </div>
                        <div className={`login-tab ${tabSelected === 'login' ? 'selected' : ''} `}>
                            <Link name="login"
                                  to="#"
                                  onClick={this.handleTabs}
                                  className="login-tabs-label">Log In</Link>
                        </div>
                    </div>
            	</div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        isOpen: state.uiState.loginModalIsOpen,
        tabSelected: state.uiState.loginModalTabSelected || 'login'
    };
})(LoginModal);
