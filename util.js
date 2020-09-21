/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
// Node.js TextEncoder
import {TextEncoder} from 'util';

export function createJwsSigningInput({encodedHeader, encodedPayload}) {
  return new TextEncoder().encode(encodedHeader + '.' + encodedPayload);
}
