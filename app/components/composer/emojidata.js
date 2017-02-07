import emojiJSON from 'emojione/emoji.json';
import emojione from 'emojione';

export const logJSON = () => {
    return console.log('emojiJSON test: ', emojiJSON['100']);
};

export const getEmojiForCategory = category => {
    const emoji = [];
    Object.keys(emojiJSON).forEach(key => {
        const value = emojiJSON[key];
        if (category === value.category){
            const imgPath = emojione.imagePathPNG;
            const imgCode = value.unicode;
            const imgType = emojione.imageType;
            const imgVer = emojione.cacheBustParam;
            emoji.push({
                path: `${ imgPath }${ imgCode }.${ imgType }${ imgVer }`,
                shortname: value.shortname,
                alt: value.name[0].toUpperCase() + value.name.slice(1),
            });
        }
    });

    return emoji;
};
