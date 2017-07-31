import {
    arrayDistance,
    booleanDistance,
    filterNullValues,
    flattenObject,
    intDistance,
    stringDistance
} from './utilities';

let maxMin,
    options;

const getValueType = (key, value) => {
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
    },
    compareObject = (sourceObject, targetObject, index) => {
        const orderedSets = [sourceObject, targetObject],
            valueDistance = {},
            breakdown = {},
            objectId = targetObject[options.id],
            keyOptionsBlacklisted = (keyOptions, value) => keyOptions && keyOptions.blacklist && keyOptions.blacklist.includes && keyOptions.blacklist.includes(value),
            addBreakdown = (k, value1, value2) => {
                if (options.breakdown) {
                    breakdown[k] = {
                        value1,
                        value2,
                        distance: valueDistance[k]
                    };
                    if (maxMin[k][1] !== null) {
                        breakdown[k].max = maxMin[k][1];
                        breakdown[k].min = maxMin[k][0];
                    }
                }
            },
            id = objectId === undefined || objectId === null ?
                index :
                objectId;

        orderedSets.sort((a, b) => Object.keys(a).length - Object.keys(b).length);
        const largestSet = orderedSets[1],
            smallestSet = orderedSets[0],
            largestSetKeys = Object.keys(largestSet);

        for (let i = 0; i < largestSetKeys.length; i += 1) {
            const k = largestSetKeys[i],
                value1 = smallestSet[k],
                value2 = largestSet[k];

            if (k === options.id || value1 === undefined) {
                continue;
            }

            const keyOptions = options.keys[k],
                valueType = getValueType(k, value1);

            if (getValueType(k, value2) !== valueType) {
                continue;
            } else if (valueType === 'array' && keyOptions && keyOptions.blacklist && value2.filter(v => keyOptions.blacklist.includes(v)).length > 0) {
                return null;
            } else if (keyOptionsBlacklisted(keyOptions, value2)) {
                return null;
            } else if (options.ignoreKeys.includes(k)) {
                continue;
            }

<<<<<<< Updated upstream
                valueDistance[k] = null;
                addBreakdown(k, value1, value2);
=======
            let finalValue = null;
>>>>>>> Stashed changes

            switch (valueType) {
                case 'string': {
                    finalValue = stringDistance(value1, value2);
                    break;
                }
                case 'number': {
                    finalValue = intDistance(value1, value2, maxMin[k][1], maxMin[k][0], keyOptions);
                    break;
                }
                case 'boolean': {
                    finalValue = booleanDistance(value1, value2);
                    break;
                }
                case 'array': {
                    finalValue = arrayDistance(value1, value2);
                    break;
                }
            }

            if (options.keys[k] && options.keys[k].weight) {
                finalValue *= 100 / options.keys[k].weight;
            }
            valueDistance[k] = finalValue;
            addBreakdown(k, value1, value2);
        }

        const filteredValueDistance = filterNullValues(valueDistance),
            filteredValueDistanceKeys = Object.keys(filteredValueDistance),
            distance = filteredValueDistanceKeys.length ?
                filteredValueDistanceKeys.reduce((sum, k) => sum + filteredValueDistance[k], 0) / (filteredValueDistanceKeys.length || 1) :
                100;

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
            blacklist: [],
            breakdown: true
        }, optionsObj || {});
        sourceObject = flattenObject(sourceObject);
        targetObjects = targetObjects.map(obj => flattenObject(obj));
        calculateMaxMin(targetObjects.concat([sourceObject]));
        targetObjects = targetObjects.map((obj, index) => compareObject(sourceObject, obj, index))
            .filter(v => v !== null && !options.blacklist.includes(v.id));
        targetObjects.sort((a, b) => a.distance - b.distance);
        return targetObjects;
    };

export default objectDistance;
