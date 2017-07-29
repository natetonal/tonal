const initialState = {
    imageUploadProgress: 0,
    imageUploadState: false
};

export default (state = initialState, action) => {
    switch (action.type){
        case 'STORAGE_UPDATE_UPLOAD_PROGRESS':
            return {
                ...state,
                imageUploadProgress: action.progress
            };
        case 'STORAGE_UPDATE_UPLOAD_STATE':
            return {
                ...state,
                imageUploadState: action.state
            };
        case 'STORAGE_RESET_STATE':
            return initialState;
        default:
            return state;
    }
};
