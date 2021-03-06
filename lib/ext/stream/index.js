'use strict';

var npm = {
    read: require('./read')
};

/**
 * @namespace stream
 * @description
 * Namespace with methods that implement stream operations, and {@link stream.read read} is the only method currently supported.
 *
 * **Synchronous Stream Processing**
 *
 * ```js
 * var stream = require('spex')(Promise).stream;
 * var fs = require('fs');
 *
 * var rs = fs.createReadStream('values.txt');
 *
 * function receiver(index, data, delay) {
 *    console.log('RECEIVED:', index, data, delay);
 * }
 *
 * stream.read(rs, receiver)
 *     .then(function (data) {
 *         console.log('DATA:', data);
 *     })
 *     .catch(function (error) {
 *         console.log('ERROR:', error);
 *     });
 * ```
 *
 * **Asynchronous Stream Processing**
 *
 * ```js
 * var stream = require('spex')(Promise).stream;
 * var fs = require('fs');
 *
 * var rs = fs.createReadStream('values.txt');
 *
 * function receiver(index, data, delay) {
 *    return new Promise(function (resolve) {
 *        console.log('RECEIVED:', index, data, delay);
 *        resolve();
 *    });
 * }
 *
 * stream.read(rs, receiver)
 *     .then(function (data) {
 *         console.log('DATA:', data);
 *     })
 *     .catch(function (error) {
 *         console.log('ERROR:', error);
 *    });
 * ```
 *
 * @property {function} stream.read
 * Consumes and processes data from a $[Readable] stream.
 *
 */
module.exports = function (config) {
    var res = {
        read: npm.read(config)
    };
    Object.freeze(res);
    return res;
};
