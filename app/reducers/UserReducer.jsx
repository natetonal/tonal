import moment from 'moment';

const dummyPhoto = 'https://firebasestorage.googleapis.com/v0/b/tonal-development.appspot.com/o/assets%2Fheader%2Ftonal-avatar.png?alt=media&token=f7e23557-bc15-44fd-bfb5-1ddff07bc954';

const initialState = {
    uid: '',
    fbToken: '',
    fbId: '',
    email: '',
    firstName: '',
    lastName: '',
    username: '',
    location: '',
    displayName: '',
    authMethod: '',
    emailVerified: false,
    firstLogin: true,
    timeZone: -7,
    avatar: dummyPhoto,
    updatedAt: moment().format('LLLL'),
    createdAt: moment().format('LLLL'),
    followers: ['tonalnate, mecorbin'],
    following: ['tonalnate, mecorbin'],
    followerCount: 0,
    followingCount: 0,
    postCount: 0,
    recentPost: [],
    status: false,
    settings: {
        displayNotifs: true,
        blockedUsers: false
    }
};

export default (state = initialState, action) => {
    switch (action.type){
        case 'USER_DATA_STATUS':
            if (state.status !== action.status){
                return {
                    ...state,
                    status: action.status
                };
            }
            return state;
        case 'USER_ADD_DATA':
            return {
                ...state,
                ...action.data
            };
        case 'USER_RESET_DATA':
            return initialState;
        default:
            return state;
    }
};
