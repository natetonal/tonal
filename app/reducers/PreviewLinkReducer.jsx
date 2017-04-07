const initialState = {
    preview: false,
    previewType: false,
    previewHovered: false
};

export default (state = initialState, action) => {
    switch (action.type){
        case 'PL_TOGGLE_HOVER':
            return {
                ...state,
                previewHovered: !state.previewHovered
            };
        case 'PL_LOAD_PREVIEW':
            return {
                ...state,
                preview: action.preview,
                previewType: action.previewType
            };
        case 'PL_CLEAR_PREVIEW':
            return {
                ...state,
                preview: false,
                previewType: false
            };
        default:
            return state;
    }
};
