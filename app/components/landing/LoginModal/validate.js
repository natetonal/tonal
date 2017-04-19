import validator from 'validator';
import {
    blacklist,
    reservedPartial,
    reservedFull
 } from './bannednames';

const isABannedName = value => {
    let isBanned = false;
    blacklist.some(name => {
        const re = new RegExp(name, 'i');
        if (value.match(re)){
            isBanned = name;
        }
        return value.match(re);
    });

    return isBanned;
};

const isReservedPartial = value => {
    let isReserved = false;
    reservedPartial.some(name => {
        if (value.startsWith(name)){
            isReserved = name;
        }
        return value.startsWith(name);
    });

    return isReserved;
};

const isReservedFull = value => {
    let isReserved = false;
    reservedFull.some(name => {
        if (name === value){
            isReserved = name;
        }
        return name === value;
    });

    return isReserved;
};

export const validate = values => {
    const errors = {};

    if (!values.email) {
        errors.email = 'Required';
    } else if (!validator.isEmail(values.email)) {
        errors.email = 'Invalid email address';
    }

    // Display Name Validation
    if (!values.displayName){
        errors.displayName = 'Required';
    } else {
        const nameMin = 3;
        const nameMax = 40;
        const nameLen = values.displayName.length;
        const nameBanned = isABannedName(values.displayName);
        const nameResPartial = isReservedPartial(values.displayName);
        const nameResFull = isReservedFull(values.displayName);

        if (nameLen < nameMin){
            errors.displayName = `-${ nameMin - nameLen }`;
        } else if (nameLen > nameMax){
            errors.displayName = `+${ nameLen - nameMax }`;
        } else if (nameBanned){
            errors.displayName = 'No banned words';
        } else if (nameResPartial){
            errors.displayName = `${ nameResPartial } is a reserved display name prefix`;
        } else if (nameResFull){
            errors.displayName = `${ nameResFull } is not an allowable display name`;
        }
    }

    // Username Validation
    if (!values.username){
        errors.username = 'Required';
    } else {
        const userMin = 6;
        const userMax = 32;
        const userLen = values.username.length;
        const userAllowedChars = values.username.match(/^[a-zA-Z0-9]+$/i);
        const userStartsWithLetter = values.username.match(/^[a-zA-Z]/i);
        const userBanned = isABannedName(values.username);
        const userResPartial = isReservedPartial(values.username);
        const userResFull = isReservedFull(values.username);

        if (userLen < userMin){
            errors.username = `-${ userMin - userLen }`;
        } else if (userLen > userMax){
            errors.username = `+${ userLen - userMax }`;
        } else if (userBanned){
            errors.username = 'No banned words';
        } else if (userResPartial){
            errors.username = `${ userResPartial } is a reserved username prefix`;
        } else if (userResFull){
            errors.username = `${ userResFull } is a reserved username`;
        } else if (!userAllowedChars){
            errors.username = 'Only letters and numbers allowed';
        } else if (!userStartsWithLetter){
            errors.username = 'Must start with a letter';
        }
    }

    if (!values.password){
        errors.password = 'Required';
    } else if (values.password.length < 8){
        errors.password = 'Must be at least 8 characters';
    } else if (values.password.length > 32){
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
