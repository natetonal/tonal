import React from 'react';
import * as Redux from 'react-redux';
import { toggleLoginModal } from 'actions/UIStateActions';

export const ModalOverlay = React.createClass({

    toggleLoginModal(event){
        event.preventDefault();
        const { dispatch } = this.props;
        dispatch(toggleLoginModal());
    },

    render(){

        const { isModalOpen } = this.props;

        return (
            <div
                className={ `md-overlay ${ isModalOpen ? 'show-overlay' : '' }` }
                onClick={ this.toggleLoginModal } />
        );
    }
});

export default Redux.connect(state => {
    return {
        isModalOpen: state.uiState.loginModalIsOpen
    };
})(ModalOverlay);
