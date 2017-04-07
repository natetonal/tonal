import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Button from './Button';

export const Alert = React.createClass({

    propTypes: {
        type: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired,
        buttons: React.PropTypes.array,
        fullscreen: React.PropTypes.bool,
        animate: React.PropTypes.bool,
        message: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.object
        ]),
        onClose: React.PropTypes.func.isRequired
    },

    getDefaultProps(){

        return {
            type: 'default',
            title: 'Title',
            button: [],
            fullscreen: false,
            animate: true,
            message: 'Message',
            onClose: () => console.log('You need to pass a handler to dismiss this.')
        };
    },

    handleClose(event){

    },

    render(){

        const {
            type,
            title,
            buttons,
            fullscreen,
            animate,
            message,
            onClose
        } = this.props;

        const renderButtons = () => {
            if (!buttons) { return ''; }

            const btnWidth = Math.floor(12 / buttons.length);

            return buttons.map((button, index) => {
                const btnText = button.text || 'Click Me';
                const btnType = button.type || type;
                const btnIcon = button.icon || false;
                const isLoading = button.isLoading || false;
                const onClick = button.callback;

                return (
                    <div
                        key={ `tonal-alert-button_${ index }` }
                        className={ `tonal-alert-button small-12 large-${ btnWidth } columns` }>
                        <Button
                            type="button"
                            isLoading={ isLoading }
                            btnText={ btnText }
                            btnType={ btnType }
                            btnIcon={ btnIcon }
                            onClick={ onClick } />
                    </div>
                );
            });
        };

        const alertImg = () => {

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
        };

        return (
            <ReactCSSTransitionGroup
                transitionName={ `${ animate ? 'smooth-fadein' : '' }` }
                transitionAppear
                transitionAppearTimeout={ 200 }
                transitionEnter={ false }
                transitionLeave={ false }>
                <div
                    className={ fullscreen ? 'fullscreen' : '' }
                    ref={ element => this.fullscreen = element }
                    onClick={ e => this.fullscreen === e.target && onClose() }>
                    <div className={ `tonal-alert callout ${ type } ${ fullscreen ? 'alert-fullscreen' : '' }` }>
                        <div className="tonal-alert-title">
                            { alertImg() }
                            { title }
                        </div>
                        <div className="tonal-alert-body">
                            <div className="tonal-alert-message">
                                { message }
                            </div>
                            <div className="tonal-alert-buttons row">
                                { renderButtons() }
                            </div>
                        </div>
                    </div>
                </div>
            </ReactCSSTransitionGroup>
        );
    }
});

export default connect()(Alert);
