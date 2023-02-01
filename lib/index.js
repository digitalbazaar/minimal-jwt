/*!
 * Copyright (c) 2020-2023 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

// translate `main.js` to CommonJS
require = require('esm')(module);
module.exports = require('./main.js');
