import {
    arrayDistance,
    booleanDistance,
    calculateCurvePosition,
    flattenObject,
    getPercentage,
    intDistance,
    stringDistance
} from '../lib/utilities';

import assert from 'assert';

describe('utility functions', () => {
    it('can flatten an object', done => {
        const flatObject = flattenObject({
            test: {
                test2: ''
            }
        });

        assert.equal(Object.keys(flatObject)[0], 'test.test2');
        done();
    });

    it('can flatten an object with null values', done => {
        const flatObject = flattenObject({
            test: {
                test2: null
            },
            test3: [null]
        });

        assert.equal(Object.keys(flatObject)[0], 'test.test2');
        done();
    });

    it('can get a percentage', done => {
        assert.equal(getPercentage(25, 50), 50);
        done();
    });

    it('can find the distance between 2 strings', done => {
        assert.equal(stringDistance('X', 'X'), 0);
        assert.equal(stringDistance('Y', 'X'), 100);
        assert.equal(stringDistance('XXXX', 'XXXY'), 25);
        done();
    });

    it('can find the distance between 2 integers', done => {
        assert.equal(intDistance(4, 6, 10, 1), 20);
        assert.equal(intDistance(1, 1, 10, 1), 0);
        assert.equal(intDistance(0, 10, 10, 1), 100);
        assert.equal(intDistance(14, 16, 20, 11), 20);
        assert.equal(true, intDistance(2015, 2017, 2018, 1970) < 5);
        done();
    });

    it('can find the distance between 2 booleans', done => {
        assert.equal(booleanDistance(true, false), 100);
        assert.equal(booleanDistance(true, true), 0);
        done();
    });

    it('can find the distance between 2 arrays', done => {
        assert.equal(arrayDistance([0, 1, 2], [0, 1, 2]), 0);
        assert.equal(arrayDistance([2, 1, 0], [0, 1, 2]), 0);
        assert.equal(arrayDistance([4, 5, 6], [0, 1, 2]), 100);
        assert.equal(Math.round(arrayDistance([2], [0, 1, 2])), 67);
        done();
    });

    it('can calculate curve position', done => {
        assert.equal(calculateCurvePosition(1, 0), 1);
        assert.equal(calculateCurvePosition(10, 0), 10);

        const curveValue1 = calculateCurvePosition(1, 50),
            curveValue2 = calculateCurvePosition(2, 50),
            curveValue3 = calculateCurvePosition(98, 50),
            curveValue4 = calculateCurvePosition(99, 50);

        assert.equal(curveValue2 - curveValue1 < curveValue4 - curveValue3, true);
        done();
    });

    it('can find the distance between 2 integers with trajectory', done => {
        const distance1 = intDistance(1967, 1968, 2017, 1967, {
                trajectory: 0
            }),
            distance2 = intDistance(1967, 1968, 2017, 1967, {
                trajectory: 50
            });

        assert.equal(Math.round(distance1), 2);
        assert.equal(distance2 > 1, true);
        done();
    });

    it('can find the distance between 2 integers with trajectory in reverse', done => {
        const distance1 = intDistance(1967, 1968, 2017, 1967, {
                trajectory: 0,
                reverse: true
            }),
            distance2 = intDistance(2016, 2017, 2017, 1967, {
                trajectory: 50,
                reverse: true
            });

        assert.equal(Math.round(distance1), 2);
        assert.equal(distance2 > 50, true);
        done();
    });
});
