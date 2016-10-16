export const authReducer = (state = {}, action) => {
    switch(action.type){
        case 'LOGIN':
            return {
                ...state,
                uid: action.uid
            };
        case 'LOGOUT':
            console.log('reducer: logging out user (this should wipe the uid from authState)');
            return {
                ...state,
                uid: ""
            };
        case 'FLAG_VERIFICATION_EMAIL_AS_SENT':
            return {
                ...state,
                verificationEmailSent: true
            };
        default:
            return state;
    }
};

export const imgUrlReducer = (state = "", action) => {
    switch(action.type){
        case 'GET_IMG_URL':
            return action.imgUrl;
        default:
            return state;
    }
};

export const uiStateReducer = (state = {}, action) => {
    switch(action.type){
        case 'TOGGLE_MENU':
            return {
                ...state,
                menuIsOpen: !state.menuIsOpen
            };
        case 'TOGGLE_SEARCH':
            return{
                ...state,
                searchIsOpen: !state.searchIsOpen
            };
        case 'TOGGLE_LOGIN_MODAL':
            return{
                ...state,
                loginModalIsOpen: !state.loginModalIsOpen
            };
        case 'SWITCH_LOGIN_MODAL_TAB':
            return{
                ...state,
                loginModalTabSelected: action.tabSelected
            };
        case 'RESET_UI_STATE':
            return{};
        default:
            return state;
    }
};

export const errorsReducer = (state = null, action) => {
    switch(action.type){
        case 'ADD_ERROR_MESSAGE':
            return action.error;
        case 'RESET_ERROR_MESSAGE':
            return null;
        default:
            return state;
    }
};

const userInitialState = {
    uid: '',
    fbToken: '',
    email: '',
    firstName: '',
    lastName: '',
    displayName: '',
    timeZone: '',
    avatarPhoto: '',
    updatedAt: ''
};

export const userReducer = (state = userInitialState, action) => {
    switch(action.type){
        case 'ADD_USER_DATA':
            console.log('reducers.jsx: adding data: ', action.data);
            return {
                ...state,
                ...action.data
            };
        case 'RESET_USER_DATA':
            return userInitialState;
        default:
            return state;
    }
};
