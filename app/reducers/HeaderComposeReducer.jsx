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
        default:
            return state;
    }
};
