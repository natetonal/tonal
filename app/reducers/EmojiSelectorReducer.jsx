const initialState = {
    currentTab: 'people',
    previousTab: 'people',
    currentTabTitle: 'Smileys & People',
    previousTabTitle: 'Smileys & People',
    currentTitleDisplay: 'Smileys & People',
    skinToneModifier: 'default',
    searchText: ''
};

export default (state = initialState, action) => {
    switch (action.type){
        case 'ES_CHANGE_TAB':
            return {
                ...state,
                previousTab: state.currentTab,
                currentTab: action.tab
            };
        case 'ES_CHANGE_TAB_TITLE':
            return {
                ...state,
                previousTabTitle: state.currentTabTitle,
                currentTabTitle: action.tabTitle
            };
        case 'ES_CHANGE_TITLE_DISPLAY':
            return {
                ...state,
                currentTitleDisplay: action.titleDisplay
            };
        case 'ES_CHANGE_SEARCH_TEXT':
            return {
                ...state,
                searchText: action.searchText
            };
        case 'ES_MODIFY_SKIN_TONE':
            return {
                ...state,
                skinToneModifier: action.skinTone
            };
        default:
            return state;
    }
};
