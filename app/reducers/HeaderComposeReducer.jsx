const initialState = {
    currentTab: 'post'
};

export default (state = initialState, action) => {
    switch (action.type){
        case 'HC_CHANGE_TAB':
            return {
                ...state,
                currentTab: action.tab
            };
        case 'HC_CREATE_FAKE_POST':
            return {
                ...state,
                post: action.postData
            };
        default:
            return state;
    }
};
