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

export const skinToneArray = [
    {
        name: 'default',
        title: 'No Modifier',
        shortname: ':tone1:'
    },
    {
        name: 'tone1',
        title: 'Skin Tone Modifier 1',
        shortname: ':tone1:'
    },
    {
        name: 'tone2',
        title: 'Skin Tone Modifier 2',
        shortname: ':tone2:'
    },
    {
        name: 'tone3',
        title: 'Skin Tone Modifier 3',
        shortname: ':tone3:'
    },
    {
        name: 'tone4',
        title: 'Skin Tone Modifier 4',
        shortname: ':tone4:'
    },
    {
        name: 'tone5',
        title: 'Skin Tone Modifier 5',
        shortname: ':tone5:'
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
    if (!searchText || searchText.length === 0){ return emoji; }

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

const matchSearchText = (emoji, searchText = '') => {
    if (!searchText || searchText.length === 0){ return true; }

    const regex = new RegExp(searchText, 'gi');
    let match = regex.test(emoji.shortname);
    if (!match){
        emoji.keywords.forEach(keyword => {
            if (regex.test(keyword)){
                match = true;
            }
        });
    }

    return match;
};

const matchModifier = (emoji, category, modifier = 'default') => {

    if (category !== 'people' && category !== 'activity'){ return true; }

    if (modifier === 'default'){
        const tone = '_tone';
        const regex = new RegExp(tone, 'gi');
        if (regex.test(emoji.shortname)){
            return false;
        }
        return true;
    }

    const regex = new RegExp(modifier, 'gi');
    if (regex.test(emoji.shortname)){
        return true;
    }

    return false;
};

export const getEmoji = (category = 'people', searchText = '', modifier = 'default') => {
    let emoji = [];
    if (category !== 'search'){
        Object.keys(emojiJSON).forEach(key => {
            const value = emojiJSON[key];
            if (category === value.category &&
                matchSearchText(value, searchText) &&
                matchModifier(value, category, modifier)){
                emoji.push(getImageFromValue(value));
            }
        });
    } else {
        emoji = getEmojiFromSearchText(searchText);
    }

    return emoji;
};

export const onlyPaths = emojiArray => {
    const paths = [];
    emojiArray.forEach(emoji => {
        paths.push(emoji.path);
    });

    return paths;
};

export const isEmoji = emojiStr => {
    let isAnEmoji = false;
    Object.keys(emojiJSON).forEach(key => {
        const emoji = emojiJSON[key];
        if (emoji.shortname === emojiStr){
            isAnEmoji = true;
        }
    });

    return isAnEmoji;
};
