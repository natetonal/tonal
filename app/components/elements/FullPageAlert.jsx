import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'elements/Button';

class FullPageAlert extends Component {

    render(){
        const {
            type,
            title,
            message,
            buttons
        } = this.props;

        const renderButtons = () => {
            if (buttons){
                buttons.map(button => {
                    return ''; // Incomplete thought
                });
            }
        }
        return (
            <div className="tonal-fullpagealert">
                Herro
            </div>
        );
    }
}


FullPageAlert.propTypes = {
    type: PropTypes.string,
    title: PropTypes.string,
    message: PropTypes.string.isRequired,
    buttons: PropTypes.array,
};

FullPageAlert.defaultProps = {
    type: 'default',
    title: '',
    message: '',
    buttons: []
};

export default FullPageAlert;
