'use strict';

var lib = require('../../header');
var tools = require('../../tools');

var promise = lib.promise;
var spex = lib.main(promise);

var isError = lib.isError;

var SequenceError = require('../../../lib/errors/sequence');

describe('Sequence - negative', function () {

    describe('with invalid parameters', function () {
        var error;
        beforeEach(function (done) {
            spex.sequence()
                .catch(function (e) {
                    error = e;
                    done();
                });
        });
        it('must reject an invalid source function', function () {
            expect(isError(error)).toBe(true);
            expect(error instanceof TypeError).toBe(true);
            expect(error.message).toBe('Parameter \'source\' must be a function.');
        });
    });

    describe('source error', function () {

        describe('as Error', function () {
            var r, err = new Error('source error');
            beforeEach(function (done) {
                function source() {
                    throw err;
                }

                spex.sequence(source)
                    .catch(function (e) {
                        r = e;
                        done();
                    });
            });

            it('must reject correctly', function () {
                expect(isError(r)).toBe(true);
                expect(r instanceof SequenceError).toBe(true);
                expect(r.index).toBe(0);
                expect(r.error).toBe(err);
                expect('source' in r).toBe(true);
                expect(r.source).toBeUndefined();
                expect(tools.inspect(r)).toContain('reason: Source \'source\' threw an error at index 0.');
            });
        });

        describe('with a string value', function () {
            var r, msg = 'source error';
            beforeEach(function (done) {

                spex.sequence(function () {
                    throw msg;
                })
                    .catch(function (e) {
                        r = e;
                        done();
                    });
            });

            it('must reject correctly', function () {
                expect(isError(r)).toBe(true);
                expect(r instanceof SequenceError).toBe(true);
                expect(r.index).toBe(0);
                expect(r.message).toBe(msg);
                expect(r.error).toBe(msg);
                expect('source' in r).toBe(true);
                expect(r.source).toBeUndefined();
                expect(tools.inspect(r)).toContain('reason: Source <anonymous> threw an error at index 0.');
            });
        });

        describe('with a non-string value', function () {
            var r;
            beforeEach(function (done) {

                spex.sequence(function () {
                    throw 123;
                })
                    .catch(function (e) {
                        r = e;
                        done();
                    });
            });

            it('must reject correctly', function () {
                expect(isError(r, 'SequenceError')).toBe(true);
                expect(r.error).toBe(123);
                expect(r.message).toBe('123');
            });
        });

    });

    describe('source reject', function () {

        var error, msg = 'source reject';
        beforeEach(function (done) {
            function source() {
                return promise.reject(new Error(msg));
            }

            spex.sequence(source)
                .catch(function (e) {
                    error = e;
                    done();
                });
        });

        it('must reject correctly', function () {
            expect(isError(error)).toBe(true);
            expect(error instanceof SequenceError).toBe(true);
            expect(error.index).toBe(0);
            expect(error.message).toBe(msg);
            expect('source' in error).toBe(true);
            expect(error.source).toBeUndefined();
            expect(tools.inspect(error)).toContain('reason: Source \'source\' returned a rejection at index 0.');
        });
    });

    describe('source reject with a batch', function () {

        var r;
        beforeEach(function (done) {

            function source() {
                return spex.batch([promise.reject(123)]);
            }

            spex.sequence(source)
                .catch(function (e) {
                    r = e;
                    done();
                });
        });

        it('must reject correctly', function () {
            expect(isError(r)).toBe(true);
            expect(r instanceof SequenceError).toBe(true);
            expect(r.index).toBe(0);
            expect(r.message).toBe('123');
            expect('source' in r).toBe(true);
            expect(r.source).toBeUndefined();
            expect(tools.inspect(r)).toContain('error: BatchError {');
        });
    });

    describe('destination error', function () {

        var error, msg = 'destination error';
        beforeEach(function (done) {
            function source() {
                return 123;
            }

            function dest() {
                throw new Error(msg);
            }

            spex.sequence(source, {dest: dest})
                .catch(function (e) {
                    error = e;
                    done();
                });
        });

        it('must reject correctly', function () {
            expect(isError(error)).toBe(true);
            expect(error instanceof SequenceError).toBe(true);
            expect(error.message).toBe(msg);
            expect(error.index).toBe(0);
            expect(error.dest).toBe(123);
            expect(tools.inspect(error)).toContain('reason: Destination \'dest\' threw an error at index 0.');
        });
    });

    describe('destination reject', function () {

        var r, msg = 'destination reject';
        beforeEach(function (done) {
            function source() {
                return 123;
            }

            function dest() {
                return promise.reject(new Error(msg));
            }

            spex.sequence(source, {dest: dest})
                .catch(function (e) {
                    r = e;
                    done();
                });
        });
        it('must reject correctly', function () {
            expect(isError(r)).toBe(true);
            expect(r instanceof SequenceError).toBe(true);
            expect(r.index).toBe(0);
            expect(r.message).toBe(msg);
            expect(r.dest).toBe(123);
            expect(tools.inspect(r)).toContain('reason: Destination \'dest\' returned a rejection at index 0.');
            expect(tools.inspect(r) !== r.toString(1)).toBe(true);
        });
    });

});

describe('Sequence - positive', function () {

    describe('with a limit', function () {
        var result, limit = 100;

        function source() {
            return 123;
        }

        beforeEach(function (done) {
            spex.sequence(source, {limit: limit})
                .then(function (data) {
                    result = data;
                })
                .finally(function () {
                    done();
                });
        });
        it('must match the limit', function () {
            expect(result && typeof result === 'object').toBe(true);
            expect(result.total).toBe(limit);
            expect('duration' in result).toBe(true);
        });
    });

    describe('tracking', function () {
        var result, tracked = [];

        function source(idx) {
            if (idx < 3) {
                return idx;
            }
        }

        function dest(idx, data) {
            tracked.push(data);
            if (idx) {
                return promise.resolve();
            }
        }

        beforeEach(function (done) {
            spex.sequence(source, {dest: dest, track: true})
                .then(function (data) {
                    result = data;
                })
                .finally(function () {
                    done();
                });
        });
        it('must track and return the sequence', function () {
            expect(result instanceof Array).toBe(true);
            expect('duration' in result).toBe(true);
            expect(result).toEqual([0, 1, 2]);
            expect(result).toEqual(tracked);
        });
    });

    describe('this context', function () {
        var ctx, context = {};

        function source() {
            ctx = this;
        }

        beforeEach(function (done) {
            spex.sequence.call(context, source)
                .then(function () {
                    done();
                });
        });
        it('must be passed in correctly', function () {
            expect(ctx).toBe(context);
        });

    });

});
