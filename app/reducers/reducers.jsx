export var authReducer = (state = {}, action) => {
    console.log("action.type from authReducer: ", action.type);
    switch(action.type){
        case 'LOGIN':
            return action.uid;
        case 'LOGOUT':
            return {};
        default:
            console.log("authReducer returning default");
            return state;
    }
};

export var imgUrlReducer = (state = "", action) => {
    switch(action.type){
        case 'GET_IMG_URL':
            return action.imgUrl;
        default:
            return state;
    }
};

export var uiStateReducer = (state = {}, action) => {
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
        default:
            return state;
    }
};
