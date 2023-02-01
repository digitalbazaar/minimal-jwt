/*!
 * Copyright (c) 2019-2023 Digital Bazaar, Inc. All rights reserved.
 */
import {webcrypto as crypto} from 'node:crypto';
import {getMockHmac} from '../MockHmac.common.js';
import {test} from './common.js';

const MockHmac = getMockHmac({crypto});

test({MockHmac});
