export const toggleMenu = () => {
    return {
        type: 'UI_TOGGLE_MENU'
    };
};

export const toggleSearch = () => {
    return {
        type: 'UI_TOGGLE_SEARCH'
    };
};

export const switchHeaderMenu = (menu = false) => {
    return {
        type: 'UI_TOGGLE_HEADER_MENU',
        menu
    };
};

export const toggleNotifs = () => {
    return {
        type: 'UI_TOGGLE_NOTIFS'
    };
};

export const toggleCompose = () => {
    return {
        type: 'UI_TOGGLE_COMPOSE'
    };
};

export const toggleLoginModal = () => {
    return {
        type: 'UI_TOGGLE_LOGIN_MODAL',
    };
};

export const switchLoginModalUI = loginModalUI => {
    return {
        type: 'UI_SWITCH_LOGIN_MODAL',
        loginModalUI
    };
};

export const resetUIState = () => {
    return {
        type: 'RESET_UI_STATE'
    };
};

export const changeScreenSize = size => {
    return {
        type: 'UI_CHANGE_SCREEN_SIZE',
        size
    };
};
