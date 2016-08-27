import React from 'react';
import * as Redux from 'react-redux';
import * as actions from 'actions';

export const Input = React.createClass({

    componentWillMount(){
        this.setState({
            filled: false
        });
    },

    handleInput(){
        if(this.refs.tonalInput.value == ''){
            this.setState({ filled: false });
        } else {
            this.setState({ filled: true });
        }
    },

    render(){

        const { name, type } = this.props;
        const { filled } = this.state;

        return(

            <span className={`input input--hoshi ${filled ? "input--filled" : ""}`}>
				<input ref="tonalInput" className="input__field input__field--hoshi" type={ type || "text" } onKeyUp={this.handleInput} id="input-4" />
				<label className="input__label input__label--hoshi input__label--hoshi-color-1" htmlFor="input-4">
					<span className="input__label-content input__label-content--hoshi">
                        { name }
                    </span>
				</label>
			</span>
        );
    }
});

export default Redux.connect()(Input);
