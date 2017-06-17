import validator from 'validator';

export default values => {
    const errors = {};

    if (!values.email) {
        errors.email = 'Required';
    } else if (!validator.isEmail(values.email)) {
        errors.email = 'Invalid email address';
    }

    if (!values.password){
        errors.password = 'Required';
    } else {
        const pwMin = 8;
        const pwMax = 32;
        const pwLen = values.password.length;
        const pwHasNumber = values.password.match(/[0-9]+/);
        const pwHasLowerCase = values.password.match(/[a-z]+/);
        const pwHasUpperCase = values.password.match(/[A-Z]+/);
        const pwHasSymbol = values.password.match(/[`!"?$?%^&* ()_\-+={[}\]:;@'~#|<,>.?/]+/);
        const pwAllowedChars = values.password.match(/^[0-9A-Za-z `!"?$?%^&*()_\-+={[}\]:;@'~#|\\<,>.?\/]+$/);
        if (pwLen < pwMin){
            errors.password = 'At least 8 characters';
        } else if (pwLen > pwMax){
            errors.password = 'Less than 32 characters';
        } else if (!pwHasNumber){
            errors.password = 'At least one number';
        } else if (!pwHasLowerCase){
            errors.password = 'At least one lowercase letter';
        } else if (!pwHasUpperCase){
            errors.password = 'At least one uppercase letter';
        } else if (!pwHasSymbol){
            errors.password = 'At least one symbol';
        } else if (!pwAllowedChars){
            errors.password = 'No foreign or uncommon symbols';
        }
    }

    if (!values.confirmPassword){
        errors.confirmPassword = 'Required';
    } else if (!validator.equals(values.confirmPassword, values.password)){
        errors.confirmPassword = 'Passwords must match';
    } else if (errors.password){
        errors.confirmPassword = 'Enter a valid password';
    }

    return errors;
};
