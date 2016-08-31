import React from 'react';
import { Link } from 'react-router';
import * as Redux from 'react-redux';
import * as actions from 'actions';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Login from './Login';
import Signup from './Signup';

export const LoginModal = React.createClass({

    componentWillMount(){
        this.setState({
            tabSelected: 'login'
        });
    },

    handleTabs(event){
        event.preventDefault();
        this.setState({
            tabSelected: event.target.getAttribute('name')
        });
    },

    toggleLoginModal(event){
        event.preventDefault();
        const { dispatch } = this.props;
        dispatch(actions.toggleLoginModal());
    },

    render(){

        const { isOpen } = this.props;
        const { tabSelected } = this.state;

        return(
            <div className={`md-modal md-effect-1 ${isOpen ? "md-show" : ""}`} id="modal-1">
            	<div className="md-content">
            		<div className="login-area">
                        <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={250} transitionLeaveTimeout={1}>
                            { tabSelected === "login" ? <Login key="login" /> : <Signup key="signup" /> }
                        </ReactCSSTransitionGroup>
            		</div>
                    <div className="login-tabs">
                        <div className={`login-tab ${tabSelected === 'login' ? 'selected' : ''} `}>
                            <Link name="login"
                                  to="#"
                                  onClick={this.handleTabs}
                                  className="login-tabs-label">Log In</Link>
                        </div>
                        <div className={`login-tab ${tabSelected === 'signup' ? 'selected' : ''} `}>
                            <Link name="signup"
                                  to="#"
                                  onClick={this.handleTabs}
                                  className="login-tabs-label">Sign Up</Link>
                        </div>
                    </div>
            	</div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return { isOpen: state.uiState.loginModalIsOpen };
})(LoginModal);
