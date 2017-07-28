import levenshtein from 'js-levenshtein';

const getPercentage = (value, max) => {
    const perc = 100 / max * value;

    return isNaN(perc) || perc === Infinity ?
        100 :
        perc;
};

module.exports.flattenObject = originalObject => {
    const newObj = {},
        iterate = (obj, stack) => {
            stack = stack || '';
            Object.keys(obj).forEach(k => {
                obj[k] !== null && obj[k].constructor === Object ?
                    iterate(obj[k], k) :
                    newObj[stack === '' ?
                        k :
                        `${stack}.${k}`] = obj[k];
            });
        };

    iterate(originalObject);
    return newObj;
};

module.exports.stringDistance = (value1, value2) => {
    const value = [value1, value2];

    value.sort((a, b) => a.length - b.length);
    return getPercentage(levenshtein(value[0], value[1]), value[0].length);
};

module.exports.intDistance = (value1, value2, max, min) => {
    const value = [getPercentage(value1, max), getPercentage(value2, max)];

    value.sort((a, b) => a - b);
    return value[1] - value[0];
};

module.exports.arrayDistance = (value1, value2) => {
    const value = [value1, value2];

    value.sort((a, b) => a.length - b.length);
    return getPercentage(value[1].filter(i => !value[0].includes(i)).length, value[1].length);
};

module.exports.booleanDistance = (value1, value2) => value1 === value2 ?
    0 :
    100;

module.exports.getPercentage = getPercentage;