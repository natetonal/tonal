const initialState = {
    currentMenu: '',
    previewImage: '',
    imageFile: '',
    query: ''
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
        default:
            return state;
    }
};
