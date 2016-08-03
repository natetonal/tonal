export var authReducer = (state = {}, action) => {
    switch(action.type){
        case 'LOGIN':
            return action.uid;
        case 'LOGOUT':
            return {};
        default:
            return state;
    }
};

export var imgUrlReducer = (state = "", action) => {
    switch(action.type){
        case 'GET_IMG_URL':
            console.log('Adding to state: ', action.imgUrl);
            return action.imgUrl;
        default:
            return state;
    }
};

export var uiStateReducer = (state = {}, action) => {
    console.log(`state of ${action.type} coming into reducer: ${JSON.stringify(state)}`);
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
        default:
            return state;
    }
};
