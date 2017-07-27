module.exports.flattenObject = (originalObject) => {
    let newObj = {};

    const iterate = (obj, stack) => {
        stack = stack || '';
        Object.keys(obj).forEach(k => typeof obj[k] === "object" ? iterate(obj[k], k) : newObj[`${stack}.${k}`] = obj[k]);
    }
    iterate(originalObject);
    return newObj;
};

const getPercentage = (value, max) => Math.floor(100 / max * value);
module.exports.getPercentage = getPercentage