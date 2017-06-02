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
    followerCount: 2,
    followingCount: 2,
    postCount: 0,
    quality: 10,
    recentPost: [],
    status: false,
    blocked: {},
    followers: {
        MMxvsVGFgHY55OQKzpXKG5RpDck2: true,
        '4IaW549RW4Y07iWomkWFNvcjrH42': true
    },
    following: {
        MMxvsVGFgHY55OQKzpXKG5RpDck2: true,
        '4IaW549RW4Y07iWomkWFNvcjrH42': true
    },
    settings: {
        displayNotifs: true
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
