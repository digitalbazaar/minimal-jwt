/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
// browser TextEncoder
/* eslint-env browser */
const {TextEncoder} = self;

export function createJwsSigningInput({encodedHeader, encodedPayload}) {
  return new TextEncoder().encode(encodedHeader + '.' + encodedPayload);
}
