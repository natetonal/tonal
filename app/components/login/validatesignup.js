import validator from 'validator';
import {
    blacklist,
    reservedPartial,
    reservedFull
} from 'app/global/bannednames';

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
        const userAllowedChars = values.username.match(/[a-zA-Z0-9]+/);
        const userStartsWithLetter = values.username.match(/^[a-zA-Z]/);
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
    } else {
        const pwMin = 8;
        const pwMax = 32;
        const pwLen = values.password.length;
        const pwHasNumber = values.password.match(/[0-9]+/);
        const pwHasLowerCase = values.password.match(/[a-z]+/);
        const pwHasUpperCase = values.password.match(/[A-Z]+/);
        const pwHasSymbol = values.password.match(/[`!"?$?%^&* ()_\-+={[}\]:;@'~#|<,>.?/]+/);
        const pwAllowedChars = values.password.match(/^[0-9A-Za-z `!"?$?%^&*()_\-+={[}\]:;@'~#|\\<,>.?\/]+$/);
        const pwHasDisplayName = values.password.match(values.displayName);
        const pwHasUserName = values.password.match(values.username);
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
        } else if (pwHasDisplayName && values.displayName){
            errors.password = 'Can\'t contain your display name';
        } else if (pwHasUserName && values.username){
            errors.password = 'Can\'t contain your username';
        } else if (!pwAllowedChars){
            errors.password = 'No foreign or uncommon symbols';
        }
    }

    return errors;
};

export const warn = values => {
    const warnings = {};

    if (values.password){
        const pwLen = values.password.length;
        const pwLenGood = 10;
        const pwLenExcellent = 16;
        const pwHasNumber = values.password.match(/[0-9]+/g);
        const pwHasLowerCase = values.password.match(/[a-z]+/g);
        const pwHasUpperCase = values.password.match(/[A-Z]+/g);
        const pwHasSymbol = values.password.match(/[`!"?$?%^&* ()_\-+={[}\]:;@'~#|<,>.?/]+/g);

        const isMedium = (
            pwLen >= pwLenGood &&
            pwLen < pwLenExcellent &&
            (pwHasSymbol && pwHasSymbol.join('').length > 1) &&
            (pwHasNumber && pwHasNumber.join('').length > 1) &&
            (pwHasLowerCase && pwHasLowerCase.join('').length > 1) &&
            (pwHasUpperCase && pwHasUpperCase.join('').length > 1)
        ) || false;

        const isStrong = (
            pwLen >= pwLenExcellent &&
            (pwHasSymbol && pwHasSymbol.join('').length > 1) &&
            (pwHasNumber && pwHasNumber.join('').length > 1) &&
            (pwHasLowerCase && pwHasLowerCase.join('').length > 1) &&
            (pwHasUpperCase && pwHasUpperCase.join('').length > 1)
        ) || false;

        if (isMedium) {
            warnings.password = 'medium';
        } else if (isStrong){
            warnings.password = 'strong';
        } else {
            warnings.password = 'weak';
        }
    }

    return warnings;
};
