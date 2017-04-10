import { browserHistory } from 'react-router';

export const getPrevRoute = (route = '') => {
    return {
        type: 'RT_PREV_ROUTE',
        route
    };
};

export const pushToRoute = route => {
    return () => {
        browserHistory.push(route);
    };
};
