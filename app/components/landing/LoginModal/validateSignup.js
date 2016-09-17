import validator from 'validator';

export const validate = values => {
    const errors = {};

    const validPassword = (value) => {
        
    }

      if (!values.username) {
          errors.username = 'Required';
      } else if (values.username.length > 15) {
          errors.username = 'Must be less than 16 characters';
      } else if (values.username.length < 6) {
          errors.username = 'Must be at least 6 characters';
      } else if (!validator.isAlphanumeric(values.username)){
          errors.username = 'Can only be letters or numbers'
      }

      if (!values.email) {
          errors.email = 'Required';
      } else if (!validator.isEmail(values.email)) {
          errors.email = 'Invalid email address';
      }

      if(!values.password){
          errors.password = 'Required';
      } else if(values.password.length < 8){
          errors.password = 'Must be at least 8 characters';
      } else if(values.password.length > 31){
          errors.password = 'Must be less than 32 characters';
      }

      if(!values.confirmPassword){
          errors.confirmPassword = 'Required';
      } else if(!validator.equals(values.confirmPassword, values.password)){
          errors.confirmPassword = 'Passwords must match'
      } else if(errors.password){
          errors.confirmPassword = 'Enter a valid password'
      }

      return errors;
};

export default validate;
