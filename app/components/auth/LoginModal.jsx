import React from 'react';
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
                        <Button iconClass="icon-arrow-right" iconText="Sign In" />
            		</div>
            	</div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return { isOpen: state.uiState.loginModalIsOpen };
})(LoginModal);
