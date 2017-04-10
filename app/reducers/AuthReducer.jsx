const initialState = {
    uid: '',
    oobCode: '',
    error: ''
};

export default (state = initialState, action) => {
    switch (action.type){
        case 'LOGIN':
            return {
                ...state,
                uid: action.uid
            };
        case 'LOGOUT':
            return {
                ...state,
                uid: ''
            };
        case 'VERIFIED_EMAIL_CODE':
            return {
                ...state,
                oobCode: action.oobCode
            };
        case 'ADD_LOGIN_ERROR':
            return {
                ...state,
                error: action.error
            };
        case 'RESET_LOGIN_ERROR':
            return {
                ...state,
                error: ''
            };
        default:
            return state;
    }
};
