import React from 'react';
import { Link } from 'react-router';
import * as Redux from 'react-redux';
import * as actions from 'actions';

const LoginTabs = React.createClass({

    handleTabs(event){
        event.preventDefault();
        const tabSelected = event.target.getAttribute('name')
        console.log('LoginTabs.jsx: changing tab to ', tabSelected);
        const { dispatch } = this.props;
        dispatch(actions.switchLoginModalUI(tabSelected));
    },

    render(){

        const { loginModalUI } = this.props;

        if(loginModalUI == 'signup' || loginModalUI == 'login'){
            return (
                <div className="login-tabs">
                    <div className={`login-tab ${ loginModalUI === 'signup' ? 'selected' : '' }`}>
                        <Link name="signup"
                              to="#"
                              onClick={ this.handleTabs }
                              className="login-tabs-label">Sign Up</Link>
                    </div>
                    <div className={`login-tab ${ loginModalUI === 'login' ? 'selected' : '' }`}>
                        <Link name="login"
                              to="#"
                              onClick={ this.handleTabs }
                              className="login-tabs-label">Log In</Link>
                    </div>
                </div>
            );
        } else {
            return <div></div>;
        }
    }
});

export default Redux.connect(state => {
    return{
        loginModalUI: state.uiState.loginModalUI
    };
})(LoginTabs);
