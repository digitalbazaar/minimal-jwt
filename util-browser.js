/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
// browser TextDecoder/TextEncoder
/* eslint-env browser */
const {TextDecoder, TextEncoder} = self;

export function createJwsSigningInput({encodedHeader, encodedPayload}) {
  return new TextEncoder().encode(encodedHeader + '.' + encodedPayload);
}

export function bytesToString(bytes) {
  return new TextDecoder('utf-8').decode(bytes);
}
