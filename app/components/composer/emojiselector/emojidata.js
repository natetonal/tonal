import emojiJSON from 'emojione/emoji.json';
import emojione from 'emojione';

export const tabsArray = [
    {
        name: 'people',
        title: 'Smileys & People',
        shortname: ':smile:'
    },
    {
        name: 'nature',
        title: 'Animals & Nature',
        shortname: ':dog:'
    },
    {
        name: 'food',
        title: 'Food & Drink',
        shortname: ':apple:'
    },
    {
        name: 'activity',
        title: 'Activity',
        shortname: ':basketball:'
    },
    {
        name: 'travel',
        title: 'Travel & Places',
        shortname: ':red_car:'
    },
    {
        name: 'objects',
        title: 'Objects',
        shortname: ':bulb:'
    },
    {
        name: 'symbols',
        title: 'Symbols',
        shortname: ':symbols:'
    },
    {
        name: 'flags',
        title: 'Flags',
        shortname: ':triangular_flag_on_post:'
    },
    {
        name: 'search',
        title: 'Search',
        shortname: ':mag:'
    }
];

export const getImageFromValue = value => {
    const imgPath = emojione.imagePathPNG;
    const imgCode = value.unicode;
    const imgType = emojione.imageType;
    const imgVer = emojione.cacheBustParam;
    return {
        path: `${ imgPath }${ imgCode }.${ imgType }${ imgVer }`,
        shortname: value.shortname,
        alt: value.name[0].toUpperCase() + value.name.slice(1),
    };
};

export const getEmojiForCategory = category => {
    const emoji = [];
    if (category !== 'search'){
        Object.keys(emojiJSON).forEach(key => {
            const value = emojiJSON[key];
            if (category === value.category){
                emoji.push(getImageFromValue(value));
            }
        });
    }

    return emoji;
};

export const getPathFromShortname = shortname => {
    let img = '';
    Object.keys(emojiJSON).forEach(key => {
        const value = emojiJSON[key];
        if (shortname === value.shortname){
            img = getImageFromValue(value);
        }
    });

    return img.path;
};

export const getEmojiFromSearchText = searchText => {
    const emoji = [];
    Object.keys(emojiJSON).forEach(key => {
        const value = emojiJSON[key];
        const regex = new RegExp(searchText, 'gi');
        let match = regex.test(value.shortname);
        if (!match){
            value.keywords.forEach(keyword => {
                if (regex.test(keyword)){
                    match = true;
                }
            });
        }

        if (match){
            emoji.push(getImageFromValue(value));
        }
    });

    return emoji;
};
