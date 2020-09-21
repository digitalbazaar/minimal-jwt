/*!
 * Copyright (c) 2020 Digital Bazaar, Inc. All rights reserved.
 */
import base64url from 'base64url-universal';
import {createJwsSigningInput, bytesToString} from './util.js';

const BASE64URL_REGEX = /^[A-Za-z0-9_-]+$/;

/**
 * Serializes and signs the payload as a JWT.
 *
 * @param {object} payload - The set of claims to be signed.
 * @param {object} header -  A set of JOSE Header Parameters.
 * @param {string} header.alg -The cryptographic algorithm to secure the JWT.
 * @param {string} header.kid -The ID of the key used to secure the JWT.
 * @param {Function} signFn - Performs the signature on the JWS Signing Input.
 *
 * @returns {Promise<{string}>} Resolves with the signed JWT.
 */
export async function sign({payload, header = {}, signFn}) {
  if(!(header.alg && typeof header.alg === 'string')) {
    throw new Error('An algorithm "header.alg" must be a string.');
  }
  if(!(header.kid && typeof header.kid === 'string')) {
    throw new Error('A Key ID "header.kid" must be a string.');
  }
  if(!(signFn && typeof signFn === 'function')) {
    throw new Error('A sign function "signFn" must be specified.');
  }

  // JWS Protected Header
  const jwsHeader = {
    ...header,
    typ: header.typ || 'JWT'
  };

  // Encode the JWS Protected Header as BASE64URL(UTF8(JWS Protected Header))
  const encodedHeader = base64url.encode(JSON.stringify(jwsHeader));

  // Encode the JWS Payload as BASE64URL(UTF8(JWS Payload))
  const encodedPayload = base64url.encode(JSON.stringify(payload));

  // Create the JWS Signing Input
  // BASE64URL(UTF8(JWS Protected Header)) || '.' || BASE64URL(JWS Payload))
  const data = createJwsSigningInput({encodedHeader, encodedPayload});

  // Compute the JWS Signature
  const signature = await signFn({data});

  // Encode the JWS Signature as BASE64URL(JWS Signature)
  let encodedSignature;
  if(typeof signature === 'string' && BASE64URL_REGEX.test(signature)) {
    encodedSignature = signature;
  } else if(signature instanceof Uint8Array) {
    encodedSignature = base64url.encode(signature);
  } else {
    throw new Error('"signFn" must return a Base64URL Encoded String or an ' +
      'instance of a Uint8Array.');
  }

  // Concatenate these values in the order Header.Payload.Signature
  return encodedHeader + '.' + encodedPayload + '.' + encodedSignature;
}

/**
 * Verifies the claims of a JWT.
 *
 * @param {string} jwt - The JSON Web Token to verify.
 * @param {Function} verifyFn - Verifies the signature and header of the JWT.
 *
 * @returns {Promise<{object}>} Resolves with parsed header and claims of JWT.
 */
export async function verify({jwt, verifyFn}) {
  if(!(jwt && typeof jwt === 'string' && jwt.includes('.'))) {
    throw new TypeError('The "jwt" is invalid.');
  }
  if(!(verifyFn && typeof verifyFn === 'function')) {
    throw new Error('A verify function "verifyFn" must be specified.');
  }
  const [encodedHeader, encodedPayload, encodedSignature] = jwt.split('.');

  let header;
  try {
    header = JSON.parse(bytesToString(base64url.decode(encodedHeader)));
  } catch(e) {
    throw new Error('Could not parse JWT header; ' + e);
  }

  if(!(header && typeof header === 'object')) {
    throw new Error('Invalid JWT header.');
  }

  let payload;
  try {
    payload = JSON.parse(bytesToString(base64url.decode(encodedPayload)));
  } catch(e) {
    throw new Error('Could not parse JWT payload; ' + e);
  }

  if(!(payload && typeof payload === 'object')) {
    throw new Error('Invalid JWT payload.');
  }

  // perform signature verification
  const signature = base64url.decode(encodedSignature);
  const data = createJwsSigningInput({encodedHeader, encodedPayload});

  const {alg, kid} = header;
  const verified = await verifyFn({alg, kid, data, signature});

  if(!verified) {
    throw new Error('Failed to verify signature.');
  }

  return {header, payload};
}
