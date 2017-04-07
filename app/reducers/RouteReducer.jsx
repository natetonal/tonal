const initialState = {
    prevRoute: ''
};

export default (state = initialState, action) => {
    switch (action.type){
        case 'RT_PREV_ROUTE':
            return {
                ...state,
                prevRoute: action.route
            };
        default:
            return state;
    }
};
