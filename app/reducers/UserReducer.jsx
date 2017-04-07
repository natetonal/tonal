const initialState = {
    uid: '',
    fbToken: '',
    email: '',
    firstName: '',
    lastName: '',
    displayName: '',
    timeZone: '',
    avatarPhoto: '',
    updatedAt: '',
    createdAt: ''
};

export default (state = initialState, action) => {
    switch (action.type){
        case 'ADD_USER_DATA':
            return {
                ...state,
                ...action.data
            };
        case 'RESET_USER_DATA':
            return initialState;
        default:
            return state;
    }
};
