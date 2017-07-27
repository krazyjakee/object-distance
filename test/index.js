import assert from 'assert';
import objectDistance from '../lib/index';

const obj1 = {
        a: 2,
        b: 3,
        c: 'Hello'
    },
    obj2 = {
        x: 5,
        y: 0.1,
        z: 'XXXXX'
    },
    obj3 = {
        x: 6,
        y: 0.2,
        z: 'XXXXY'
    },
    obj4 = {
        x: 9,
        y: 0.4,
        z: 'XYYYY'
    };

describe('core', () => {
    it('can compare equal objects', done => {
        assert.equal(objectDistance(obj1, [obj1])[0], 0);
        done();
    });

    it('can compare very different objects', done => {
        assert.equal(objectDistance(obj1, [obj2])[0], 100);
        done();
    });

    it('can compare similar objects', done => {
        const distanceArray = objectDistance(obj2, [obj3])[0];

        assert.equal(true, distanceArray > 0 && distanceArray < 100);
        done();
    });

    it('can compare multiple similar objects', done => {
        const distanceArray = objectDistance(obj2, [obj3, obj4]);

        assert.equal(true, distanceArray[0] < distanceArray[1]);
        done();
    });
});
