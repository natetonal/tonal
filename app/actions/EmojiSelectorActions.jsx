// EmojiSelection actions:

export const changeTab = tab => {
    return {
        type: 'ES_CHANGE_TAB',
        tab
    };
};

export const changeTabTitle = tabTitle => {
    return {
        type: 'ES_CHANGE_TAB_TITLE',
        tabTitle
    };
};

export const changeTitleDisplay = titleDisplay => {
    return {
        type: 'ES_CHANGE_TITLE_DISPLAY',
        titleDisplay
    };
};

export const changeSearchText = searchText => {
    return {
        type: 'ES_CHANGE_SEARCH_TEXT',
        searchText
    };
};

export const modifySkinTone = skinTone => {
    return {
        type: 'ES_MODIFY_SKIN_TONE',
        skinTone
    };
};
