const initialState = {
    status: 'default',
    currentTab: 'trending',
    images: [],
    imgLimit: 40,
    searchText: '',
    offset: 0
};

export default (state = initialState, action) => {
    switch (action.type){
        case 'GIPHY_STATUS_FETCHING':
            return {
                ...state,
                status: 'fetching'
            };
        case 'GIPHY_STATUS_SUCCESS':
            return {
                ...state,
                status: 'success',
                offset: action.offset,
                images: action.images
            };
        case 'GIPHY_STATUS_FAILURE':
            return {
                ...state,
                status: 'failure'
            };
        case 'GIPHY_CHANGE_SEARCH_TEXT':
            return {
                ...state,
                images: [],
                offset: 0,
                searchText: action.searchText
            };
        case 'GIPHY_SWITCH_TABS':
            return {
                ...state,
                images: [],
                offset: 0,
                currentTab: action.tab
            };
        case 'GIPHY_RESET_STATE':
            return {
                ...state,
                status: 'default',
                currentTab: 'trending',
                images: [],
                searchText: '',
                offset: 0
            };
        case 'GIPHY_RESET_IMAGES':
            return {
                ...state,
                images: [],
                offset: 0
            };
        default:
            return state;
    }
};
