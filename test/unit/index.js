/*!
 * Copyright (c) 2019-2023 Digital Bazaar, Inc. All rights reserved.
 */
import {createRequire} from 'node:module';
import {getMockHmac} from '../MockHmac.common.js';
import {test} from './common.js';
const require = createRequire(import.meta.url);
const crypto = require('isomorphic-webcrypto');

const MockHmac = getMockHmac({crypto});

test({MockHmac});
