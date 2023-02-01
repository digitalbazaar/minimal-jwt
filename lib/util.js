/*!
 * Copyright (c) 2020-2023 Digital Bazaar, Inc. All rights reserved.
 */
// Node.js TextDecoder/TextEncoder
import {TextDecoder, TextEncoder} from './text-codec.js';
import base64url from 'base64url-universal';

export function createJwsSigningInput({encodedHeader, encodedPayload}) {
  return new TextEncoder().encode(encodedHeader + '.' + encodedPayload);
}

export function b64UrlEncodedStringToObject({str, name}) {
  let obj;
  try {
    obj = JSON.parse(bytesToString(base64url.decode(str)));
  } catch(e) {
    throw new Error(`Could not parse ${name}; ` + e);
  }

  if(!(obj && typeof obj === 'object')) {
    throw new Error(`Invalid ${name}.`);
  }

  return obj;
}

function bytesToString(bytes) {
  return new TextDecoder('utf-8').decode(bytes);
}
