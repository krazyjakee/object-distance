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
            valueDistance = {},
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
                valueDistance[k] = 100;
            } else if (value1 === null) {
                valueDistance[k] = value2 === null ?
                    0 :
                    100;
            } else {
                switch (value1.constructor) {
                    case String: {
                        valueDistance[k] = stringDistance(value1, value2);
                        break;
                    }
                    case Number: {
                        valueDistance[k] = intDistance(value1, value2, maxMin[k][1], maxMin[k][0]);
                        break;
                    }
                    case Boolean: {
                        valueDistance[k] = booleanDistance(value1, value2);
                        break;
                    }
                    case Array: {
                        valueDistance[k] = arrayDistance(value1, value2);
                        break;
                    }
                    default: {
                        valueDistance[k] = 100;
                    }
                }
            }
        });

        const breakdown = {};
        Object.keys(valueDistance).map(k => {
            breakdown[k] = maxMin[k][1] !== null ?
                {
                    max: maxMin[k][1],
                    min: maxMin[k][0],
                    distance: valueDistance[k]
                } :
                {
                    distance: valueDistance[k]
                };
        });
        return {
            id,
            distance: Object.values(valueDistance).reduce((sum, a) => sum + a, 0) / (Object.values(valueDistance).length || 1),
            breakdown
        };
    },
    calculateMaxMin = targetObjects => {
        maxMin = {};
        targetObjects.forEach(obj => {
            Object.keys(obj).forEach(k => {
                if (maxMin[k] === undefined) {
                    maxMin[k] = [null, null];
                }
                if (obj[k] !== null) {
                    switch (obj[k].constructor) {
                        case Number:
                            if (obj[k] > maxMin[k][1] || maxMin[k][1] === null) {
                                maxMin[k][1] = obj[k];
                            } else if (obj[k] < maxMin[k][0] || maxMin[k][0] === null) {
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
        calculateMaxMin(targetObjects.concat([sourceObject]));
        targetObjects = targetObjects.map((obj, index) => compareObject(sourceObject, obj, index));
        targetObjects.sort((a, b) => a.distance - b.distance);
        return targetObjects;
    };

export default objectDistance;
