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
    }

    return errors;
};
