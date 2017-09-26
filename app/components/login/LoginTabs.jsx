import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { switchLoginModalUI } from 'actions/UIStateActions';

class LoginTabs extends Component {

    handleTabs = event => {
        event.preventDefault();
        const tabSelected = event.target.getAttribute('name');
        const { dispatch } = this.props;
        dispatch(switchLoginModalUI(tabSelected));
    }

    render(){

        const { loginModalUI } = this.props;

        if (loginModalUI === 'signup' ||
            loginModalUI === 'login'){
            return (
                <div className="login-tabs">
                    <div className={ `login-tab ${ loginModalUI === 'signup' ? 'selected' : '' }` }>
                        <Link
                            name="signup"
                            to="#"
                            onClick={ this.handleTabs }
                            className="login-tabs-label">
                            Sign Up
                        </Link>
                    </div>
                    <div className={ `login-tab ${ loginModalUI === 'login' ? 'selected' : '' }` }>
                        <Link
                            name="login"
                            to="#"
                            onClick={ this.handleTabs }
                            className="login-tabs-label">
                            Log In
                        </Link>
                    </div>
                </div>
            );
        }

        return <div />;
    }
}

export default connect(state => {
    return {
        loginModalUI: state.uiState.loginModalUI
    };
})(LoginTabs);
