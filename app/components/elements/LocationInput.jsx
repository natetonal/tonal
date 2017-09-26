import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from './Input';

const LocationInput = ComposedInput => {
    class thisInput extends Component {

        componentDidMount = () => {

            const input = this.childRef.inputRef;
            const options = {
                types: ['(cities)']
            };

            this.autocomplete = new google.maps.places.Autocomplete(input, options);
            this.autocomplete.addListener('place_changed', () => {
                const place = this.autocomplete.getPlace().formatted_address;
                if (place){
                    this.props.onPlaceChange(place);
                }
            });
        }

        render() {

            return (
                <ComposedInput
                    { ...this.props }
                    ref={ element => this.childRef = element }
                    onBlur={ () => console.log('composed input just blurred.') } />
            );
        }
    }

    thisInput.propTypes = {
        onPlaceChange: PropTypes.func.isRequired
    };

    return thisInput;
};

export default LocationInput(Input);
