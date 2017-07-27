import {
    flattenObject,
    getPercentage
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

    it('can get a percentage', done => {
        assert.equal(getPercentage(25, 50), 50);
        done();
    });

    it('can get a reverse percentage', done => {
        assert.equal(getPercentage(5, 20), 25);
        done();
    });
});
