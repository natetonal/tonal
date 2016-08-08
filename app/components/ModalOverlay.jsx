import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

export const ModalOverlay = React.createClass({

    toggleLoginModal(event){
        event.preventDefault();
        const { dispatch } = this.props;
        dispatch(actions.toggleLoginModal());
    },

    render(){

        const { isModalOpen } = this.props;
        
        return(
            <div className={`md-overlay ${ isModalOpen ? "show-overlay" : ""}`}
                 onClick={ this.toggleLoginModal }>
            </div>
        );
    }
});

export default Redux.connect(state => {
    return {
        isModalOpen: state.uiState.loginModalIsOpen
    };
})(ModalOverlay);
