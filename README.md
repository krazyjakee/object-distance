[![Build Status](https://travis-ci.org/krazyjakee/object-distance.svg?branch=master)](https://travis-ci.org/krazyjakee/object-distance)
[![NPM Version](https://img.shields.io/npm/v/object-distance.svg)](https://www.npmjs.com/package/object-distance)
[![Downloads](https://img.shields.io/npm/dm/object-distance.svg)](https://www.npmjs.com/package/object-distance)

# Object-Distance

## Installation
- `npm install object-distance`
- `import objectDistance from 'object-distance'`

## Usage
```javascript
objectDistance(objectToCompare, [objectsToCompareAgainst], options);
/*
    Returns an array of distance objects with id and percentage...
    [{
        id: 0,
        distance: 4.25453, // very similar
        breakdown: {} // an object containing details of the calculation
    }, {
        id: 1,
        distance: 100, // not similar at all
        breakdown: {}
    }]
*/

// The second parameter can also be a single object to compare with.
objectDistance({}, {}); // { id: 0, distance: 0 }
```

## Options

- `id` the name of the identifier key (defaults to 'id'). This key will be ignored when calculating the distance.
```javascript
{
    id: 'name'
}
```javascript
- `blacklist` an array of IDs who's object properties will not contribute to the distance.
```
{
    blacklist: [2345, 52, 4523]
}
```
- `ignoreKeys` an array of key names/paths to ignore
```javascript
{
    ignoreKeys: ['a', 'b', 'c.childkey`]
}
```
- `keys` an object containing properties for individual key names.
    - `type` force a type for this key. If the key type does not match this type, it will be ignored. Type can be `string`, `number`, `boolean` or `array`.
    - `weight` the percentage of importance this value has. Use high percentages (over 100) to reduce the distance and lower than one hundred to increase distance. Basically, if the value should have less bearing on the final result, decrease the percentage.
    - `blacklist` an array of values. If the blacklisted values appear anywhere in the target values, the entire object will be ignored.
```javascript
{
    keys: {
        count: {
            type: 'number',
            weight: 200
        },
        type: {
            type: 'string',
            weight: 74,
            blacklist: ["fruit", "vegetable"]
        }
    }
}
```


It's also worth checking out [the test file](https://github.com/krazyjakee/object-distance/blob/master/test/index.js) to see real working examples.

## How it works.
- The objects are flattened to one dimention.
- The values are compared based on variable type.
- `Strings` are compared using [levenshtein](https://www.npmjs.com/package/js-levenshtein).
- `Integers` are compared and given distance based on the maximum and minimum values for the entire set.
- `Arrays` are checked to see if the values appear anywhere in the other array despite order.
- `Boolean` are either a 0 or 100 distance.

## Why use this?
One use case is taking a big set of data objects and finding the most similar ones. The smaller the distance the higher the similarity.
