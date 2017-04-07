import React from 'react';
import Button from 'elements/Button';

export const FullPageAlert = React.createClass({

    propTypes: {
        type: React.PropTypes.string,
        title: React.PropTypes.string,
        message: React.PropTypes.string.isRequired,
        buttons: React.PropTypes.array,
    },

    getDefaultProps(){

        return {
            type: 'default',
            title: '',
            message: '',
            button: []
        };
    },

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
                    return (

                    )
                });
            }
        }
        return (
            <div className="tonal-fullpagealert">
                Herro
            </div>
        );
    }

});

export default FullPageAlert;
