/*!
 * Copyright (c) 2019-2023 Digital Bazaar, Inc. All rights reserved.
 */
import {getMockHmac} from '../MockHmac.common.js';
import {test} from './common.js';

const crypto = globalThis.crypto;

const MockHmac = getMockHmac({crypto});

test({MockHmac});
