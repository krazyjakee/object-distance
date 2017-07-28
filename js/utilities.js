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

const getPercentage = (value, max) => {
    const perc = 100 / max * value;

    return isNaN(perc) || perc === Infinity ?
        100 :
        perc;
};

module.exports.getPercentage = getPercentage;
