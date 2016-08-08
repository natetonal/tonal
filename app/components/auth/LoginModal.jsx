import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

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
            		<div>
            			<p>This is a modal window. You can do the following things with it:</p>
            			<ul>
            				<li><strong>Read:</strong> Modal windows will probably tell you something important so don't forget to read what it says.</li>
            				<li><strong>Look:</strong> modal windows enjoy a certain kind of attention; just look at it and appreciate its presence.</li>
            				<li><strong>Close:</strong> click on the button below to close the modal.</li>
            			</ul>
            			<button className="md-close" onClick={this.toggleLoginModal }>Close me!</button>
            		</div>
            	</div>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return { isOpen: state.uiState.loginModalIsOpen };
})(LoginModal);
