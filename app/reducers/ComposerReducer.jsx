const initialState = {
    currentValue: '',
    currentMenu: '',
    previewImage: '',
    imageFile: '',
    query: '',
    editors: {},
};

export default (state = initialState, action) => {
    switch (action.type){
        case 'COM_CHANGE_MENU':
            return {
                ...state,
                currentMenu: action.menu
            };
        case 'COM_PREVIEW_IMAGE':
            return {
                ...state,
                previewImage: action.image
            };
        case 'COM_UPDATE_EDITORS':
            return {
                ...state,
                editors: action.editors
            };
        case 'COM_TOGGLE_EDITING':
            return {
                ...state,
                editors: {
                    ...state.editors,
                    [action.key]: {
                        ...state.editors[action.key],
                        editing: !state.editors[action.key].editing
                    }
                }
            };
        case 'COM_UPDATE_VALUE':
            return {
                ...state,
                editors: {
                    ...state.editors,
                    [action.key]: {
                        ...state.editors[action.key],
                        value: action.value
                    }
                }
            };
        case 'COM_SET_IMAGE_UPLOAD':
            return {
                ...state,
                imageFile: action.imageFile
            };
        case 'COM_UPDATE_SUGGESTION_QUERY':
            return {
                ...state,
                query: action.query
            };
        case 'COM_RESET_STATE':
            return initialState;
        default:
            return state;
    }
};
