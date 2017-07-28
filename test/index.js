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
    },
    obj5 = {
        a: [0, 1, 2]
    },
    obj6 = {
        a: [0, 1]
    },
    obj7 = {
        a: null
    },
    obj8 = {
        id: 41554,
        genres: [],
        themes: [1],
        keywords: [],
        status: [null],
        rating: 0,
        follows: 0,
        platform: [['Odyssey', 'odyssey--1', 88]],
        year: 1983
    },
    obj9 = {
        id: 21748,
        genres: [],
        themes: [],
        keywords: [],
        status: [null],
        rating: 0,
        follows: 0,
        platform: [],
        year: null
    };

describe('core', () => {

    it('can return index as id', done => {
        assert.equal(objectDistance(obj1, [obj1, obj2, obj3])[2].id, 2);
        done();
    });

    it('can return objectId as id', done => {
        assert.equal(objectDistance(obj1, [obj8, obj9])[1].id, 21748);
        done();
    });

    it('can compare equal objects', done => {
        assert.equal(objectDistance(obj1, [obj1])[0].distance, 0);
        done();
    });

    it('can compare very different objects', done => {
        assert.equal(objectDistance(obj1, [obj2])[0].distance, 100);
        done();
    });

    it('can compare objects with null values', done => {
        assert.equal(objectDistance(obj1, [obj7])[0].distance, 100);
        done();
    });

    it('can compare similar objects', done => {
        const distanceArray = objectDistance(obj2, [obj3])[0].distance;

        assert.equal(true, distanceArray >= 0 && distanceArray < 100);
        done();
    });

    it('can compare multiple similar objects', done => {
        const distanceArray = objectDistance(obj2, [obj3, obj4]);

        assert.equal(true, distanceArray[0].distance < distanceArray[1].distance);
        done();
    });

    it('can compare arrays', done => {
        assert.equal(Math.floor(objectDistance(obj5, [obj6])[0].distance), 66);
        done();
    });

    it('can compare more complex sets', done => {
        const distanceArray = objectDistance(obj8, obj9)[0].distance;

        assert.equal(true, distanceArray >= 0 && distanceArray < 100);
        done();
    });
});
