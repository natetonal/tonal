import React from 'react';

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

    render(){

        const {
            label,
            input,
            type,
            meta: {
                asyncValidating,
                touched,
                error
            }
        } = this.props;

        const filled = input.value || false;

        const color = () => {
            if (touched && error){
                return 'bad';
            } else if (touched && !error){
                return 'good';
            }
            return 'main';
        };

        return (
            <span className={ `input input--hoshi ${ filled || (touched && error) ? 'input--filled' : '' }` }>
                <input
                    { ...input }
                    className="input__field input__field--hoshi"
                    type={ type || 'text' }
                    id="input-4" />
                <label
                    className={ `input__label input__label--hoshi input__label--hoshi-color-${ color() }` }
                    htmlFor="input-4">
                    <span className="input__label-content input__label-content--hoshi">
                        { label } { touched && error && <span className="input-error">({error})</span> }
                    </span>
                </label>
                { asyncValidating && <i className="fa fa-spinner fa-spin fa-pull-right fa-fw" /> }
            </span>
        );
    }
});

export default Input;
