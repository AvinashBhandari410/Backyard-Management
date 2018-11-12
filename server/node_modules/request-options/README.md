# request-options

[![Build Status](https://travis-ci.org/clocked0ne/request-options.svg)](https://travis-ci.org/clocked0ne/request-options)

Default options object generator written in ES6 for the popular NodeJS package Request, providing a generic set of request options
for the [request](https://www.npmjs.com/package/request) package that can be augmented or overwritten by providing [`options`](#options).

## Install

```bash
$ npm install -S request-options
```

## Usage
### requestOptions( [options] )
```js
@param {Object} [options]
@returns {Object}
```

### options
Any valid [request options](https://www.npmjs.com/package/request#requestoptions-callback) object

### defaults
These defaults are intended for communication with APIs/services that accept and return JSON:

* json: true
* gzip: true
* timeout: 10000

The defaults can be overwritten by providing your own properties in `options` with the new values. Any additional values will be ignored, use the `options` object for your extended options.

### Examples
The basic use case will return true for json and gzip, as well as a timeout of 10 seconds
```js
const requestOptions = require('request-options');
const request = require('request');

function responseHandler (err, res, body) {
  // handle request response
}

request(requestOptions(), responseHandler);

// requestOptions => {
  json: true,
  gzip: true,
  timeout: 10000
}
```

### Adding additional options
```js
const requestOptions = require('request-options');
const request = require('request');

const options = {
  method: 'get',
  url: 'https://api.yoursite.com/endpoint'
};

function responseHandler (err, res, body) {
  // handle request response
}

request(requestOptions(options), responseHandler);

// requestOptions => {
  method: 'get',
  url: 'https://api.yoursite.com/endpoint',
  json: true,
  gzip: true,
  timeout: 10000
}
```

### Overwriting the defaults
```js
const requestOptions = require('request-options');
const request = require('request');

const options = {
  method: 'get',
  url: 'https://api.yoursite.com/endpoint'
  gzip: false,
  timeout: 20000
};

function responseHandler (err, res, body) {
  // handle request response
}

request(requestOptions(options), responseHandler);

// requestOptions => {
  method: 'get',
  url: 'https://api.yoursite.com/endpoint',
  json: true,
  gzip: false,
  timeout: 20000
}
```

Notice how the default property `json` is still present and the value left unchanged

## Tests

The test suite is located in the `test/` directory. All new features are
expected to have corresponding test cases. Ensure that the complete test suite
passes by executing:

```bash
$ npm test
```

## License
[MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2017 Nigel Horton
