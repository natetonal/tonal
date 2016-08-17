import React from 'react';
import { Link } from 'react-router';
import * as Redux from 'react-redux';
import * as actions from 'actions';

import Input from './../helpers/Input';
import Button from './../helpers/Button';

// <button className="md-close" onClick={this.toggleLoginModal }></button>

export const LoginModal = React.createClass({

    toggleLoginModal(event){
        event.preventDefault();
        const { dispatch } = this.props;
        dispatch(actions.toggleLoginModal());
    },

    render(){

        const { isOpen } = this.props;

        return(
            <div className={`md-modal md-effect-1 ${isOpen ? "md-show" : ""}`} id="modal-1">
            	<div className="md-content">
                    <button className="md-close" onClick={this.toggleLoginModal }></button>
            		<div>
                        <Input name="Email or Username" />
                        <Input name="Password" type="password" />
                        <Button btnIcon="" btnText="Sign In" hoverArrow="true" />
                        <p className="text-center">-OR-</p>
                        <Button btnIcon="fa-facebook-official" btnText="Sign In With Facebook" hoverArrow="false" />
                        <p className="text-center">
                            <Link to="#" className="forgot-password">I forgot my password</Link>
                        </p>
            		</div>
            	</div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return { isOpen: state.uiState.loginModalIsOpen };
})(LoginModal);
