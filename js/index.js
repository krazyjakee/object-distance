import {
    flattenObject,
    getPercentage
} from './utilities';

import levenshtein from 'js-levenshtein';

let maxMin,
    options;

const compareObject = (sourceObject, targetObject, index) => {
        const orderedSets = [sourceObject, targetObject],
            valueDistance = [],
            objectId = targetObject[options.idKey || 'id'],
            id = objectId === undefined || objectId === null ?
                index :
                objectId;

        orderedSets.sort((a, b) => Object.keys(a).length - Object.keys(b).length);
        Object.keys(orderedSets[1]).forEach(k => {
            const value1 = orderedSets[0][k],
                value2 = orderedSets[1][k];

            if (value1 === undefined) {
                valueDistance.push(100);
            } else if (value1 === null) {
                valueDistance.push(value2 === null ?
                    0 :
                    100);
            } else {
                switch (value1.constructor) {
                    case String: {
                        const value = [value1, value2];

                        value.sort((a, b) => a.length - b.length);
                        valueDistance.push(getPercentage(levenshtein(value[0], value[1]), value[0].length));
                        break;
                    }
                    case Number: {
                        const max = maxMin[k][1],
                            sorted = [getPercentage(value1, max), getPercentage(value2, max)];

                        sorted.sort((a, b) => a - b);
                        valueDistance.push(sorted[1] - sorted[0]);
                        break;
                    }
                    case Boolean: {
                        valueDistance.push(value1 === value2 ?
                            0 :
                            100);
                        break;
                    }
                    case Array: {
                        const value = [value1, value2];

                        value.sort((a, b) => a.length - b.length);
                        valueDistance.push(getPercentage(value[1].filter(i => value[0].includes(i)).length, value[1].length));
                    }
                }
            }
        });
        return {
            id,
            distance: valueDistance.reduce((sum, a) => sum + a, 0) / (valueDistance.length || 1)
        };
    },
    calculateMaxMin = targetObjects => {
        maxMin = {};
        targetObjects.forEach(obj => {
            Object.keys(obj).forEach(k => {
                if (maxMin[k] === undefined) {
                    maxMin[k] = [obj[k], obj[k]];
                } else if (obj[k] !== null) {
                    switch (obj[k].constructor) {
                        case Number:
                            if (obj[k] > maxMin[k][1]) {
                                maxMin[k][1] = obj[k];
                            } else if (obj[k] < maxMin[k][0]) {
                                maxMin[k][0] = obj[k];
                            }
                            break;
                    }
                }
            });
        });
    },
    objectDistance = (sourceObject, targetObjects, optionsObj) => {
        if (!targetObjects) {
            return false;
        }
        if (targetObjects.constructor === Object) {
            targetObjects = [targetObjects];
        }
        options = optionsObj || {};
        sourceObject = flattenObject(sourceObject);
        targetObjects = targetObjects.map(obj => flattenObject(obj));
        calculateMaxMin(targetObjects);
        return targetObjects.map((obj, index) => compareObject(sourceObject, obj, index));
    };

export default objectDistance;
