import moment from 'moment';

const dummyPhoto = 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Fheader%2Ftonal-avatar.png?alt=media&token=f7e23557-bc15-44fd-bfb5-1ddff07bc954';

const initialState = {
    uid: '',
    fbToken: '',
    fbId: '',
    email: '',
    firstName: '',
    lastName: '',
    userName: '',
    location: '',
    displayName: '',
    timeZone: -7,
    avatar: dummyPhoto,
    updatedAt: moment().format('LLLL'),
    createdAt: moment().format('LLLL'),
    followers: 0,
    following: 0
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
