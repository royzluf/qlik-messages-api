const assert = require('assert');
const { isPalindrom } = require('./helpers');

describe('Qlik Messages - unit tests', function () {
    describe('Positive isPalindrom', function () {
        it('', function () {
            assert.equal(isPalindrom('xxyxx'), true);
        });
    });

    describe('Negative isPalindrom', function () {
        it('', function () {
            assert.equal(isPalindrom('xxyxxx'), false);
        });
    });
});
