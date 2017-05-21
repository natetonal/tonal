const initialState = {
    followers: [],
    following: []
};

export default (state = initialState, action) => {
    switch (action.type){
        case 'FOLLOW_ADD_FOLLOWER':
            return {
                ...state,
                followers: [
                    ...state.followers,
                    action.follower
                ]
            };
        default:
            return state;
    }
};
