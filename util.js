/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
// Node.js TextDecoder/TextEncoder
import {TextDecoder, TextEncoder} from 'util';

export function createJwsSigningInput({encodedHeader, encodedPayload}) {
  return new TextEncoder().encode(encodedHeader + '.' + encodedPayload);
}

export function bytesToString(bytes) {
  return new TextDecoder('utf-8').decode(bytes);
}
