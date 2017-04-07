export const toggleHover = () => {
    return {
        type: 'PL_TOGGLE_HOVER'
    };
};

export const loadPreview = (preview, previewType) => {
    return {
        type: 'PL_LOAD_PREVIEW',
        preview,
        previewType
    };
};

export const clearPreview = () => {
    return {
        type: 'PL_CLEAR_PREVIEW'
    };
};
