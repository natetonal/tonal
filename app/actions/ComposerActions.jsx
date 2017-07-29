// Composer actions:

export const resetState = () => {
    return {
        type: 'COM_RESET_STATE'
    };
};

export const updateValue = (value = '') => {
    return {
        type: 'COM_UPDATE_VALUE',
        value
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
