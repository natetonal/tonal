import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleLoginModal } from 'actions/UIStateActions';

class ModalOverlay extends Component {

    toggleLoginModal = event => {
        event.preventDefault();
        const { dispatch } = this.props;
        dispatch(toggleLoginModal());
    }

    render(){

        const { isModalOpen } = this.props;

        return (
            <div
                className={ `md-overlay ${ isModalOpen ? 'show-overlay' : '' }` }
                onClick={ this.toggleLoginModal } />
        );
    }
}

export default connect(state => {
    return {
        isModalOpen: state.uiState.loginModalIsOpen
    };
})(ModalOverlay);
