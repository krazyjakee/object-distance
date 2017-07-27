import {
    flattenObject,
    getPercentage
} from './utilities';

import levenshtein from 'js-levenshtein';

let maxMin;

const compareObject = (sourceObject, targetObject) => {
        const orderedSets = [sourceObject, targetObject],
            valueDistance = [];

        orderedSets.sort((a, b) => Object.keys(a).length - Object.keys(b).length);
        Object.keys(orderedSets[1]).forEach(k => {
            const value1 = orderedSets[0][k],
                value2 = orderedSets[1][k];

            if (value1 === undefined) {
                valueDistance.push(100);
            } else {
                switch (typeof value1) {
                    case 'string': {
                        const value = [value1, value2];

                        value.sort((a, b) => a.length - b.length);
                        valueDistance.push(getPercentage(levenshtein(value[0], value[1]), value[0].length));
                        break;
                    }
                    case 'number': {
                        const max = maxMin[k][1],
                            sorted = [getPercentage(value1, max), getPercentage(value2, max)];

                        sorted.sort((a, b) => a - b);
                        valueDistance.push(sorted[1] - sorted[0]);
                        break;
                    }
                    case 'boolean': {
                        valueDistance.push(value1 === value2 ?
                            0 :
                            100);
                        break;
                    }
                }
            }
        });
        return Math.floor(valueDistance.reduce((sum, a) => sum + a, 0) / (valueDistance.length || 1));
    },
    calculateMaxMin = targetObjects => {
        maxMin = {};
        targetObjects.forEach(obj => {
            Object.keys(obj).forEach(k => {
                if (maxMin[k] === undefined) {
                    maxMin[k] = [obj[k], obj[k]];
                } else {
                    switch (typeof obj[k]) {
                        case 'number':
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
    objectDistance = (sourceObject, targetObjects) => {
        sourceObject = flattenObject(sourceObject);
        targetObjects = targetObjects.map(obj => flattenObject(obj));
        calculateMaxMin(targetObjects);
        return targetObjects.map(obj => compareObject(sourceObject, obj));
    };

export default objectDistance;
