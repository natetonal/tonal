import React from 'react';

export const Input = React.createClass({


    render(){

        const { label, input, type, filled, touched, error } = this.props;
        const color = () => {
            if(touched && error){
                return "bad";
            } else if(touched && !error){
                return "good";
            }
            return "main";
        }

        console.log(`color for ${ label }: `, color());

        return(

            <span className={`input input--hoshi ${ filled || touched && error ? "input--filled" : ""}`}>
				<input { ...input }
                       ref="tonalInput"
                       className="input__field input__field--hoshi"
                       type={ type || "text" }
                       id="input-4" />
				<label className={`input__label input__label--hoshi input__label--hoshi-color-${ color() }`} htmlFor="input-4">
					<span className="input__label-content input__label-content--hoshi">
                        { label } { touched && error && <span className="input-error">({error})</span> }
                    </span>
				</label>
			</span>
        );
    }
});

export default Input;
