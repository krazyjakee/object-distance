import levenshtein from 'js-levenshtein';

const getPercentage = (value, max) => {
        const perc = 100 / max * value;

        if (isNaN(perc) || perc === Infinity) {
            return 100;
        }
        return perc;
    },
    calculateCurvePosition = (value, trajectory) => value * Math.pow(value, trajectory / 100);

module.exports.getPercentage = getPercentage;
module.exports.calculateCurvePosition = calculateCurvePosition;

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

module.exports.filterNullValues = originalObject => {
    const newObj = {};

    Object.keys(originalObject).forEach(k => {
        if (originalObject[k] !== null) {
            newObj[k] = originalObject[k];
        }
    });
    return newObj;
};

module.exports.stringDistance = (value1, value2) => {
    const value = [value1, value2];

    value.sort((a, b) => a.length - b.length);
    return getPercentage(levenshtein(value[0], value[1]), value[0].length);
};

module.exports.intDistance = (value1, value2, max, min, keyOptions) => {
    if (value1 === value2) {
        return 0;
    }
    keyOptions = keyOptions || {};
    const baseMax = max - (min - 1),
        value = [getPercentage(value1 - min, baseMax), getPercentage(value2 - min, baseMax)];

    value.sort((a, b) => a - b);

    if (keyOptions.trajectory) {
        value[0] = calculateCurvePosition(value[0], keyOptions.trajectory);
        value[1] = calculateCurvePosition(value[1], keyOptions.trajectory);
        if (keyOptions.reverse) {
            return 100 - (value[1] - value[0]);
        }
    }
    return value[1] - value[0];
};

module.exports.arrayDistance = (value1, value2) => {
    if (JSON.stringify(value1) === JSON.stringify(value2)) {
        return 0;
    }
    const value = [value1, value2];

    value.sort((a, b) => a.length - b.length);
    return getPercentage(value[1].filter(i => !value[0].includes(i)).length, value[1].length);
};

module.exports.booleanDistance = (value1, value2) => value1 === value2 ?
    0 :
    100;
