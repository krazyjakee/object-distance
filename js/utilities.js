module.exports.flattenObject = originalObject => {
    const newObj = {},
        iterate = (obj, stack) => {
            stack = stack || '';
            Object.keys(obj).forEach(k => {
                obj[k] !== null && obj[k].constructor === Object ?
                    iterate(obj[k], k) :
                    newObj[`${stack}.${k}`] = obj[k];
            });
        };

    iterate(originalObject);
    return newObj;
};

const getPercentage = (value, max) => Math.floor(100 / max * value);

module.exports.getPercentage = getPercentage;
