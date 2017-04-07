export default (state = '', action) => {
    switch (action.type){
        case 'GET_IMG_URL':
            return action.imgUrl;
        default:
            return state;
    }
};
