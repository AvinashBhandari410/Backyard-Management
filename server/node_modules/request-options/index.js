'use strict';

/**
 * provides a generic set of request options for the npm request module that can be augmented
 *
 * @param {Object} [options]
 * @returns {*|{}}
 */
module.exports = (options = {}) => {
    if(!options || typeof options !== 'object')
        throw new Error('Additional options must be provided as JSON');
    return Object.assign(
        {},
        {
            json: true,
            gzip: true,
            timeout: 10000
        },
        options
    );
};
