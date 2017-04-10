import validator from 'validator';

export const validate = values => {
    const errors = {};

    if (!values.email) {
        errors.email = 'Required';
    } else if (!validator.isEmail(values.email)) {
        errors.email = 'Invalid email address';
    }

    if (!values.password){
        errors.password = 'Required';
    } else if (values.password.length < 8){
        errors.password = 'Must be at least 8 characters';
    } else if (values.password.length > 31){
        errors.password = 'Must be less than 32 characters';
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

export default validate;
