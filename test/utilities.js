import {
    arrayDistance,
    booleanDistance,
    flattenObject,
    getPercentage,
    intDistance,
    stringDistance
} from '../lib/utilities';

import assert from 'assert';

describe('core', () => {
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
        assert.equal(intDistance(4, 6, 10, 0), 20);
        assert.equal(intDistance(1, 1, 10, 0), 0);
        assert.equal(intDistance(0, 10, 10, 0), 100);
        assert.equal(intDistance(14, 16, 20, 10), 20);
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
        assert.equal(Math.floor(arrayDistance([2], [0, 1, 2])), 66);
        done();
    });
});
