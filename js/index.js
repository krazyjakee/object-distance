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
            objectId = targetObject[options.id],
            id = objectId === undefined || objectId === null ?
                index :
                objectId;

        orderedSets.sort((a, b) => Object.keys(a).length - Object.keys(b).length);
        Object.keys(orderedSets[1]).forEach(k => {
            if (k === options.id || options.ignoreKeys.includes(k)) {
                return;
            }
            const value1 = orderedSets[0][k],
                value2 = orderedSets[1][k];

            if (value1 === undefined || value2 === undefined || value1 === null || value2 === null) {
                valueDistance[k] = null;
            } else {
                switch (getValueType(k, value1)) {
                    case 'string': {
                        valueDistance[k] = stringDistance(value1, value2);
                        break;
                    }
                    case 'number': {
                        valueDistance[k] = intDistance(value1, value2, maxMin[k][1], maxMin[k][0]);
                        break;
                    }
                    case 'boolean': {
                        valueDistance[k] = booleanDistance(value1, value2);
                        break;
                    }
                    case 'array': {
                        valueDistance[k] = arrayDistance(value1, value2);
                        break;
                    }
                    default: {
                        valueDistance[k] = null;
                    }
                }
            }
        });

        const breakdown = {};
        Object.keys(valueDistance).forEach(k => {
            if (valueDistance[k]) {
                breakdown[k] = maxMin[k][1] !== null ?
                    {
                        max: maxMin[k][1],
                        min: maxMin[k][0],
                        distance: valueDistance[k]
                    } :
                    {
                        distance: valueDistance[k]
                    };
            }
        });
        return {
            id,
            distance: Object.values(valueDistance).filter(v => v !== null).reduce((sum, a) => sum + a, 0) / (Object.values(valueDistance).length || 1),
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
        if (optionsObj) {
            options = Object.assign({}, {
                id: 'id',
                ignoreKeys: [],
                keys: {}
            }, optionsObj);
        }
        sourceObject = flattenObject(sourceObject);
        targetObjects = targetObjects.map(obj => flattenObject(obj));
        calculateMaxMin(targetObjects.concat([sourceObject]));
        targetObjects = targetObjects.map((obj, index) => compareObject(sourceObject, obj, index));
        targetObjects.sort((a, b) => a.distance - b.distance);
        return targetObjects;
    },
    getValueType = (key, value) => {
        let actualType = null;

        switch (value.constructor) {
            case String: {
                actualType = 'string';
                break;
            }
            case Number: {
                actualType = 'number';
                break;
            }
            case Boolean: {
                actualType = 'boolean';
                break;
            }
            case Array: {
                actualType = 'array';
                break;
            }
        }
        if (options.keys[key] && options.keys[key].type !== actualType) {
            return null;
        }
        return actualType;
    };

export default objectDistance;
