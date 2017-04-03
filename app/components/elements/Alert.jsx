import React from 'react';
import { connect } from 'react-redux';

export const Alert = React.createClass({

    propTypes: {
        type: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        button: React.PropTypes.string,
        message: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.object
        ])
    },

    getDefaultProps(){

        return {
            type: 'default',
            title: 'Title',
            message: 'Message',
            button: ''
        };
    },

    getButton(){

        const { type, button } = this.props;

        switch (type){
            case 'default':
                return <i className="fa fa-bolt" aria-hidden="true" />;
            case 'info':
                return <i className="fa fa-info-circle" aria-hidden="true" />;
            case 'success':
                return <i className="fa fa-hand-peace-o" aria-hidden="true" />;
            case 'error':
                return <i className="fa fa-times-circle" aria-hidden="true" />;
            case 'warning':
                return <i className="fa fa-exclamation-triangle" aria-hidden="true" />;
            case 'admin':
                return <i className="fa fa-bullhorn" aria-hidden="true" />;
            default:
                return '';
        }
    },

    render(){

        const { type, title, message, button } = this.props;

        return (
            <div className={ `tonal-alert callout ${ type }` }>
                <div className="tonal-alert-title">
                    <h4>
                        { this.getButton() }
                        { title }
                    </h4>
                </div>
                <div className="tonal-alert-body">{ message }</div>
            </div>
        );
    }
});

export default connect()(Alert);
