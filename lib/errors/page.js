'use strict';

var npm = {
    u: require('util'),
    os: require('os'),
    utils: require('../utils/static')
};

var errorReasons = {
    0: 'Page with index %d rejected.',
    1: 'Source %s returned a rejection at index %d.',
    2: 'Source %s threw an error at index %d.',
    3: 'Destination %s returned a rejection at index %d.',
    4: 'Destination %s threw an error at index %d.',
    5: 'Source %s returned a non-array value at index %d.'
};

/**
 * @interface errors.PageError
 * @augments external:Error
 * @description
 * This type represents all errors rejected by method {@link page}, except for {@link external:TypeError TypeError}
 * when the method receives invalid input parameters.
 *
 * @property {string} name
 * Standard {@link external:Error Error} property - error type name = `PageError`.
 *
 * @property {string} message
 * Standard {@link external:Error Error} property - the error message.
 *
 * @property {string} stack
 * Standard {@link external:Error Error} property - the stack trace.
 *
 * @property {} error
 * The error that was thrown, or the rejection reason.
 *
 * @property {number} index
 * Index of the element in the sequence for which the error/rejection occurred.
 *
 * @property {number} duration
 * Duration (in milliseconds) of processing until the error/rejection occurred.
 *
 * @property {string} reason
 * Textual explanation of why the method failed.
 *
 * @property {} source
 * Resolved `data` parameter that was passed into the `source` function.
 *
 * It is only set when the error/rejection occurred inside the `source` function.
 *
 * @property {} dest
 * Resolved `data` parameter that was passed into the `dest` function.
 *
 * It is only set when the error/rejection occurred inside the `dest` function.
 *
 * @see
 * {@link page},
 * {@link batch}
 *
 */
function PageError(e, code, cbName, duration) {

    this.index = e.index;
    this.duration = duration;
    this.error = e.error;

    if ('source' in e) {
        this.source = e.source;
    }

    if ('dest' in e) {
        this.dest = e.dest;
    }

    if (this.error instanceof Error) {
        this.message = this.error.message;
    } else {
        this.message = this.error;
        if (typeof this.message !== 'string') {
            this.message = npm.u.inspect(this.message);
        }
    }

    if (code) {
        cbName = cbName ? ('\'' + cbName + '\'') : '<anonymous>';
        this.reason = npm.u.format(errorReasons[code], cbName, e.index);
    } else {
        this.reason = npm.u.format(errorReasons[code], e.index);
    }

    Error.captureStackTrace(this, PageError);

}

npm.u.inherits(PageError, Error);
PageError.prototype.name = 'PageError';

/**
 * @method errors.PageError.toString
 * @description
 * Creates a well-formatted multi-line string that represents the error.
 *
 * It is called automatically when writing the object into the console.
 *
 * @param {number} [level=0]
 * Nested output level, to provide visual offset.
 *
 * @returns {string}
 */
PageError.prototype.toString = function (level) {

    level = level > 0 ? parseInt(level) : 0;

    var gap0 = npm.utils.messageGap(level),
        gap1 = npm.utils.messageGap(level + 1),
        lines = [
            'PageError {',
            gap1 + 'message: ' + JSON.stringify(this.message),
            gap1 + 'reason: ' + this.reason,
            gap1 + 'index: ' + this.index,
            gap1 + 'duration: ' + this.duration
        ];

    lines.push(gap1 + 'error: ' + npm.utils.formatError(this.error, level + 1));
    lines.push(gap0 + '}');
    return lines.join(npm.os.EOL);
};

npm.utils.addInspection(PageError, function () {
    return this.toString();
});

module.exports = PageError;
