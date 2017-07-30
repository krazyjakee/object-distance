import {
    arrayDistance,
    booleanDistance,
    flattenObject,
    intDistance,
    stringDistance,
    filterNullValues
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
        const largestSet = orderedSets[1],
            smallestSet = orderedSets[0],
            largestSetKeys = Object.keys(largestSet);

        for (let i = 0; i < largestSetLength.length; i += 1) {
            const k = largestSetKeys[i];

            if (k === options.id || options.ignoreKeys.includes(k)) {
                continue;
            }
            const value1 = smallestSet[k],
                value2 = largestSet[k];

            if (value1 === undefined) {
                valueDistance[k] = null;
            } else {
                const keyOptions = options.keys[k];

                switch (getValueType(k, value1)) {
                    case 'string': {
                        if (keyOptions && keyOptions.blacklist && keyOptions.blacklist.includes(value2)) {
                            return null;
                        }
                        valueDistance[k] = stringDistance(value1, value2);
                        break;
                    }
                    case 'number': {
                        if (keyOptions && keyOptions.blacklist && keyOptions.blacklist.includes(value2)) {
                            return null;
                        }
                        valueDistance[k] = intDistance(value1, value2, maxMin[k][1], maxMin[k][0]);
                        break;
                    }
                    case 'boolean': {
                        if (keyOptions && keyOptions.blacklist && keyOptions.blacklist.includes(value2)) {
                            return null;
                        }
                        valueDistance[k] = booleanDistance(value1, value2);
                        break;
                    }
                    case 'array': {
                        if (keyOptions && keyOptions.blacklist && value2.filter(v => keyOptions.blacklist.includes(v)).length > 0) {
                            return null;
                        }
                        valueDistance[k] = arrayDistance(value1, value2);
                        break;
                    }
                    default: {
                        valueDistance[k] = null;
                    }
                }
            }
        };

        const breakdown = {},
            filteredValueDistance = filterNullValues(valueDistance),
            filteredValueDistanceKeys = Object.keys(filteredValueDistance),
            distance = filteredValueDistanceKeys.length ?
                filteredValueDistanceKeys.reduce((sum, k) => {
                    const weight = options.keys[k] && options.keys[k].weight ?
                        100 / options.keys[k].weight :
                        1;
                    return sum + (filteredValueDistance[k] * weight)
                }, 0) / (filteredValueDistanceKeys.length || 1) :
                100;

        Object.keys(valueDistance).forEach(k => {
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
            distance,
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
        options = Object.assign({}, {
            id: 'id',
            ignoreKeys: [],
            keys: {},
            blacklist: []
        }, optionsObj || {});
        sourceObject = flattenObject(sourceObject);
        targetObjects = targetObjects.map(obj => flattenObject(obj));
        calculateMaxMin(targetObjects.concat([sourceObject]));
        targetObjects = targetObjects.map((obj, index) => compareObject(sourceObject, obj, index))
            .filter(v => v !== null && !options.blacklist.includes(v.id));
        targetObjects.sort((a, b) => a.distance - b.distance);
        return targetObjects;
    },
    getValueType = (key, value) => {
        let actualType = null;

        switch (value !== null && value.constructor) {
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
        if (options.keys[key] && options.keys[key].type && options.keys[key].type !== actualType) {
            return null;
        }
        return actualType;
    };

export default objectDistance;
