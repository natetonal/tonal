const initialAuthState = {
    uid: "",
    oobCode: ""
};

export const authReducer = (state = {}, action) => {
    switch(action.type){
        case 'LOGIN':
            return {
                ...state,
                uid: action.uid
            };
        case 'LOGOUT':
            return {
                ...state,
                uid: ""
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

export const imgUrlReducer = (state = "", action) => {
    switch(action.type){
        case 'GET_IMG_URL':
            return action.imgUrl;
        default:
            return state;
    }
};

const initialUIState = {
    menuIsOpen: false,
    searchIsOpen: false,
    notifsIsOpen: false,
    loginModalIsOpen: false,
    loginModalUI: 'signup'
};

export const uiStateReducer = (state = initialUIState, action) => {
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
        case 'TOGGLE_NOTIFS':
            return{
                ...state,
                notifsIsOpen: !state.notifsIsOpen
            };
        case 'TOGGLE_LOGIN_MODAL':
            return{
                ...state,
                loginModalIsOpen: !state.loginModalIsOpen
            };
        case 'SWITCH_LOGIN_MODAL_UI':
            return{
                ...state,
                loginModalUI: action.loginModalUI
            };
        case 'RESET_UI_STATE':
            return initialUIState;
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

const initialUserState = {
    uid: "",
    fbToken: "",
    email: "",
    firstName: "",
    lastName: "",
    displayName: "",
    timeZone: "",
    avatarPhoto: "",
    updatedAt: "",
    createdAt: ""
};

export const userReducer = (state = initialUserState, action) => {
    switch(action.type){
        case 'ADD_USER_DATA':
            return {
                ...state,
                ...action.data
            };
        case 'RESET_USER_DATA':
            return initialUserState;
        default:
            return state;
    }
};
