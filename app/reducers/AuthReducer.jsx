const initialState = {
    uid: '',
    oobCode: ''
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
        default:
            return state;
    }
};
