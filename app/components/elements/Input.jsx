import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export const Input = React.createClass({

    propTypes: {
        label: React.PropTypes.string.isRequired,
        input: React.PropTypes.object.isRequired,
        type: React.PropTypes.string.isRequired,
    },

    getDefaultProps(){
        return {
            label: '',
            input: {},
            type: '',
            touched: false,
            error: ''
        };
    },

    getInitialState(){
        return {
            showPassword: false
        };
    },

    togglePasswordView(){
        this.setState({
            showPassword: !this.state.showPassword
        });
    },

    render(){

        const {
            label,
            input,
            type,
            onPaste,
            tooltip,
            meta: {
                asyncValidating,
                touched,
                error,
                warning
            }
        } = this.props;

        const { showPassword } = this.state;
        const filled = input.value || false;

        const color = () => {
            if (touched && error){
                return 'bad';
            } else if (touched && !error){
                return 'good';
            }
            return 'main';
        };


        const renderTooltip = () => {
            if (tooltip){
                return (
                    <div className="tonal-tooltip">
                        <i
                            className="input-option fa fa-question-circle"
                            aria-hidden="true" />
                        <span className="tooltiptext tooltip-left">
                            { tooltip }
                        </span>
                    </div>
                );
            }

            return '';
        };

        const renderLoader = () => {
            if (asyncValidating){
                return (
                    <div className="input-loader">
                        <i className="fa fa-spinner fa-spin fa-fw" />
                    </div>
                );
            }

            return '';
        };

        const renderLabel = () => {
            if (!touched ||
                (touched && !error)){
                return <span>{ label } </span>;
            }

            return '';
        };

        const renderWarning = () => {
            if (touched && error){
                return (
                    <span>
                        <span className="input-error">({ error })</span>
                    </span>
                );
            } else if (
                touched &&
                !error &&
                warning &&
                type === 'password'
            ){
                return (
                    <span>
                        (Strength: <span className={ `input-${ warning }` }>{ warning }</span>)
                    </span>
                );
            }

            return '';
        };

        const renderPasswordToggler = () => {
            if (type === 'password' && showPassword){
                return (
                    <i
                        className="input-option fa fa-eye-slash"
                        aria-hidden="true"
                        onClick={ this.togglePasswordView } />
                );
            } else if (type === 'password' && !showPassword){
                return (
                    <i
                        className="input-option fa fa-eye"
                        aria-hidden="true"
                        onClick={ this.togglePasswordView } />
                );
            }

            return '';
        };

        return (
            <span className={ `input input--hoshi ${ filled || (touched && error) ? 'input--filled' : '' }` }>
                <div className="input-options">
                    { renderPasswordToggler() }
                    { renderTooltip() }
                    { renderLoader() }
                </div>
                <input
                    { ...input }
                    onPaste={ e => onPaste(e) }
                    className="input__field input__field--hoshi"
                    type={ showPassword ? 'text' : type || 'text' }
                    id="input-4" />
                <label
                    className={ `input__label input__label--hoshi input__label--hoshi-color-${ color() }` }
                    htmlFor="input-4">
                    <span className="input__label-content input__label-content--hoshi">
                        <ReactCSSTransitionGroup
                            transitionName="swipe-left"
                            transitionEnterTimeout={ 300 }
                            transitionLeaveTimeout={ 300 }>
                            { renderLabel() }
                        </ReactCSSTransitionGroup>
                        <ReactCSSTransitionGroup
                            transitionName="swipe-left"
                            transitionEnterTimeout={ 300 }
                            transitionLeaveTimeout={ 300 }>
                            { renderWarning() }
                        </ReactCSSTransitionGroup>
                    </span>
                </label>
            </span>
        );
    }
});

export default Input;
