import {
    arrayDistance,
    booleanDistance,
    flattenObject,
    intDistance,
    stringDistance
} from './utilities';

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
            if (k === options.idKey || k === 'id') {
                return;
            }
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
                        valueDistance.push(stringDistance(value1, value2));
                        break;
                    }
                    case Number: {
                        valueDistance.push(intDistance(value1, value2, maxMin[k][1], maxMin[k][0]));
                        break;
                    }
                    case Boolean: {
                        valueDistance.push(booleanDistance(value1, value2));
                        break;
                    }
                    case Array: {
                        valueDistance.push(arrayDistance(value1, value2));
                        break;
                    }
                    default: {
                        valueDistance.push(100);
                    }
                }
            }
        });
        return {
            id,
            distance: valueDistance.reduce((sum, a) => sum + a, 0) / (valueDistance.length || 1),
            distances: valueDistance
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
        targetObjects = targetObjects.map((obj, index) => compareObject(sourceObject, obj, index));
        targetObjects.sort((a, b) => a.distance - b.distance);
        return targetObjects;
    };

export default objectDistance;
