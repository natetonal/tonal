import React from 'react';
import { connect } from 'react-redux';

export const Alert = React.createClass({

    propTypes: {
        type: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        message: React.PropTypes.string.isRequired,
        button: React.PropTypes.string,
    },

    getDefaultProps(){

        return{
            type: 'default',
            title: 'Title',
            message: 'Message',
            button: ''
        };
    },

    getButton(){

        const { type, button } = this.props;

        switch(type){
            case 'default':
                return <i className="fa fa-bolt" aria-hidden="true"></i>;
            case 'info':
                return <i className="fa fa-info-circle" aria-hidden="true"></i>;
            case 'success':
                return <i className="fa fa-hand-peace-o" aria-hidden="true"></i>;
            case 'error':
                return <i className="fa fa-times-circle" aria-hidden="true"></i>;
            case 'warning':
                return <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>;
            case 'admin':
                return <i className="fa fa-bullhorn" aria-hidden="true"></i>;
            default:
                return ''
        }
    },

    render(){

        const { type, title, message, button } = this.props;

        return(
            <div className={`tonal-alert callout ${ type }`}>
                <h4>
                    { this.getButton() }
                    { title }
                </h4>
                <p>{ message }</p>
            </div>
        );
    }
});

export default connect()(Alert);
