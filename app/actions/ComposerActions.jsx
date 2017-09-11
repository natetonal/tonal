// Composer actions:

export const resetState = () => {
    return {
        type: 'COM_RESET_STATE'
    };
};

export const updateEditors = editors => {
    return {
        type: 'COM_UPDATE_EDITORS',
        editors
    };
};

export const updateValue = (key, value = '') => {
    return {
        type: 'COM_UPDATE_VALUE',
        key,
        value
    };
};

export const toggleEditing = key => {
    return {
        type: 'COM_TOGGLE_EDITING',
        key
    };
};

export const changeMenu = (menu = '') => {
    return {
        type: 'COM_CHANGE_MENU',
        menu
    };
};

export const setPreviewImage = (image = '') => {
    return {
        type: 'COM_PREVIEW_IMAGE',
        image
    };
};

export const setImageUpload = (imageFile = '') => {
    return {
        type: 'COM_SET_IMAGE_UPLOAD',
        imageFile
    };
};

export const updateSuggestionQuery = (query = '') => {
    return {
        type: 'COM_UPDATE_SUGGESTION_QUERY',
        query
    };
};

// Make keys with HTML value & editing bools. Read that in wherever needed.
// editorIsOpen: true,
// editors: {
//     'abcde': {
//         value: 'hi',
//         editing: false
//     },
//     'main': {
//         value: 'what',
//         editing: true
//     }
// }

export const checkEditors = (key, value, editing) => {
    return (dispatch, getState) => {
        const editors = getState().composer.editors || {};
        const keys = Object.keys(editors);
        const thisEditor = editors[key] || {};

        if (!value && !editing){
            const newObj = Object.keys(keys)
                .filter(thisKey => thisKey !== key)
                .reduce((obj, thisKey) => {
                    obj[thisKey] = editors[thisKey];
                    return obj;
                }, {});
            dispatch(updateEditors(newObj));
        } else if (value && value !== thisEditor.value){
            dispatch(updateValue(key, value));
        }
    };
};
