import React from 'react';
import Input from './Input';

const LocationInput = ComposedInput => React.createClass({

    propTypes: {
        onPlaceChange: React.PropTypes.func.isRequired
    },

    componentDidMount(){

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

    },

    render() {

        return (
            <ComposedInput
                { ...this.props }
                ref={ element => this.childRef = element }
                onBlur={ () => console.log('composed input just blurred.') } />
        );
    }
});

export default LocationInput(Input);
