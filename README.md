# Object-Distance

## Installation
- `npm install object-distance`
- `import objectDistance from 'object-distance'`

## Usage
```javascript
objectDistance(objectToCompare, [objectsToCompareAgainst]); // Returns an array of distance percentages ([0, 100]).

// The second parameter can also be a single object to compare with.
objectDistance({}, {}); // [0]
```

## How it works.
- The objects are flattened to one dimention.
- The values are compared based on variable type.
- `Strings` are compared using [levenshtein](https://www.npmjs.com/package/js-levenshtein).
- `Integers` are compared and given distance based on the maximum and minimum values for the entire set.
- `Arrays` are checked to see if the values appear anywhere in the other array despite order.
- `Boolean` are either a 0 or 100 distance.

## Why use this?
One use case is taking a big set of data and finding similarities between them. The closer the distance the more similar they are.
