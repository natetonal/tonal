const initialState = {
    status: false,
    data: false
};

export default (state = initialState, action) => {
    switch (action.type){
        case 'FEED_ADD_POST':
            return {
                ...state,
                data: {
                    ...state.data,
                    [action.key]: action.post
                }
            };
        case 'FEED_ADD_DATA':
            return {
                ...state,
                data: action.data
            };
        case 'FEED_UPDATE_STATUS':
            return {
                ...state,
                status: action.status
            };
        default:
            return state;
    }
};
