const initialState = {
    headerMenu: false,
    menuIsOpen: false,
    searchIsOpen: false,
    notifsIsOpen: false,
    composeIsOpen: false,
    loginModalIsOpen: false,
    loginModalUI: 'signup'
};

export default (state = initialState, action) => {
    switch (action.type){
        case 'UI_TOGGLE_MENU':
            return {
                ...state,
                menuIsOpen: !state.menuIsOpen
            };
        case 'UI_TOGGLE_HEADER_MENU':
            return {
                ...state,
                headerMenu: action.menu
            };
        case 'UI_TOGGLE_SEARCH':
            return {
                ...state,
                searchIsOpen: !state.searchIsOpen
            };
        case 'UI_TOGGLE_NOTIFS':
            return {
                ...state,
                notifsIsOpen: !state.notifsIsOpen
            };
        case 'UI_TOGGLE_COMPOSE':
            return {
                ...state,
                composeIsOpen: !state.composeIsOpen
            };
        case 'UI_TOGGLE_LOGIN_MODAL':
            return {
                ...state,
                loginModalIsOpen: !state.loginModalIsOpen
            };
        case 'UI_SWITCH_LOGIN_MODAL':
            return {
                ...state,
                loginModalUI: action.loginModalUI
            };
        case 'RESET_UI_STATE':
            return initialState;
        default:
            return state;
    }
};
