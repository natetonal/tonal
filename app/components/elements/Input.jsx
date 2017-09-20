import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Tooltip from './Tooltip';

class Input extends Component {

    togglePasswordView(){
        this.setState({
            showPassword: !this.state.showPassword
        });
    }

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
                    <Tooltip text={ tooltip }>
                        <i className="fa fa-question-circle" aria-hidden="true" />
                    </Tooltip>
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

        console.log('Input received: ', input.value);
        return (
            <span className={ `input input--hoshi ${ filled || (touched && error) ? 'input--filled' : '' }` }>
                <div className="input-options">
                    { renderPasswordToggler() }
                    { renderTooltip() }
                    { renderLoader() }
                </div>
                <input
                    { ...input }
                    ref={ element => this.inputRef = element }
                    onPaste={ e => onPaste(e) }
                    className="input__field input__field--hoshi"
                    type={ showPassword ? 'text' : type || 'text' }
                    id="input-4" />
                <label
                    className={ `input__label input__label--hoshi input__label--hoshi-color-${ color() }` }
                    htmlFor="input-4">
                    <span className="input__label-content input__label-content--hoshi">
                        <ReactCSSTransitionGroup
                            transitionName="smooth-fadein"
                            transitionEnterTimeout={ 200 }
                            transitionLeaveTimeout={ 200 }>
                            { renderLabel() }
                        </ReactCSSTransitionGroup>
                        <ReactCSSTransitionGroup
                            transitionName="smooth-fadein"
                            transitionEnterTimeout={ 200 }
                            transitionLeaveTimeout={ 200 }>
                            { renderWarning() }
                        </ReactCSSTransitionGroup>
                    </span>
                </label>
            </span>
        );
    }
}

Input.propTypes = {
    label: PropTypes.string.isRequired,
    input: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    inputRef: PropTypes.func
};

Input.defaultProps = {
    label: '',
    input: {},
    type: '',
    touched: false,
    error: '',
    inputRef: false
};

export default Input;
