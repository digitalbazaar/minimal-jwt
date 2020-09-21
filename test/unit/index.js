/*!
 * Copyright (c) 2019-2020 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const base64url = require('base64url-universal');
const chai = require('chai');
const MockHmac = require('../MockHmac.js');

const JWT = require('../../');

const should = chai.should();

describe('minimal-jwt', () => {
  let header;
  let hmac;
  let payload;
  beforeEach(async () => {
    hmac = await MockHmac.create();
    header = {alg: 'HS256', kid: '1738'};
    payload = {data: 'drip or drown'};
  });

  describe('JWT.sign', () => {
    it('should sign w/ a signFn that returns a base64url string', async () => {
      async function signFn({data}) {
        return hmac.sign({data});
      }

      let jwt;
      let err;
      try {
        jwt = await JWT.sign({payload, header, signFn});
      } catch(e) {
        err = e;
      }

      should.not.exist(err);
      should.exist(jwt);
      jwt.should.be.a('string');
      jwt.split('.').should.have.length(3);
    });

    it('should sign w/ a signFn that returns a Uint8Array', async () => {
      async function signFn({data}) {
        const encodedSignature = await hmac.sign({data});
        return base64url.decode(encodedSignature);
      }

      let jwt;
      let err;
      try {
        jwt = await JWT.sign({payload, header, signFn});
      } catch(e) {
        err = e;
      }

      should.not.exist(err);
      should.exist(jwt);
      jwt.should.be.a('string');
      jwt.split('.').should.have.length(3);
    });

    it('should fail to sign w/ a malformed "alg"', async () => {
      header.alg = 1872;

      async function signFn({data}) {
        return hmac.sign({data});
      }

      let jwt;
      let err;
      try {
        jwt = await JWT.sign({payload, header, signFn});
      } catch(e) {
        err = e;
      }

      should.exist(err);
      should.not.exist(jwt);
      const errMsg = 'An algorithm "header.alg" must be a string.';
      err.message.should.contain(errMsg);
    });

    it('should fail to sign w/ a malformed "kid"', async () => {
      header.kid = 1941;

      async function signFn({data}) {
        return hmac.sign({data});
      }

      let jwt;
      let err;
      try {
        jwt = await JWT.sign({payload, header, signFn});
      } catch(e) {
        err = e;
      }

      should.exist(err);
      should.not.exist(jwt);
      const errMsg = 'A Key ID "header.kid" must be a string.';
      err.message.should.contain(errMsg);
    });

    it('should fail to sign w/ a malformed "signFn"', async () => {
      const signFn = 'this should be a function';

      let jwt;
      let err;
      try {
        jwt = await JWT.sign({payload, header, signFn});
      } catch(e) {
        err = e;
      }

      should.exist(err);
      should.not.exist(jwt);
      const errMsg = 'A sign function "signFn" must be specified.';
      err.message.should.contain(errMsg);
    });

    it('should fail to sign w/ an invalid output for signFn', async () => {
      async function signFn({data}) {
        return data + '!@#$%^&*()_+';
      }

      let jwt;
      let err;
      try {
        jwt = await JWT.sign({payload, header, signFn});
      } catch(e) {
        err = e;
      }

      should.exist(err);
      should.not.exist(jwt);
      const errMsg = '"signFn" must return a Base64URL Encoded String or an ' +
        'instance of a Uint8Array.';
      err.message.should.contain(errMsg);
    });

    it('should produce the same JWT regardless of signFn return type',
      async () => {
        async function signFn1({data}) {
          return hmac.sign({data});
        }

        async function signFn2({data}) {
          const encodedSignature = await hmac.sign({data});
          return base64url.decode(encodedSignature);
        }

        let jwt1;
        let jwt2;
        let err;
        try {
          jwt1 = await JWT.sign({payload, header, signFn: signFn1});
          jwt2 = await JWT.sign({payload, header, signFn: signFn2});
        } catch(e) {
          err = e;
        }

        should.not.exist(err);
        should.exist(jwt1);
        should.exist(jwt2);
        should.equal(jwt1, jwt2);
      });
  });
  describe('JWT.verify', () => {
    it('should verify a valid JWT', async () => {
      async function signFn({data}) {
        return hmac.sign({data});
      }
      const jwt = await JWT.sign({payload, header, signFn});

      async function verifyFn({alg, kid, data, signature}) {
        alg.should.equal(header.alg);
        kid.should.equal(header.kid);

        return hmac.verify({data, signature});
      }

      let res;
      let err;
      try {
        res = await JWT.verify({jwt, verifyFn});
      } catch(e) {
        err = e;
      }

      should.not.exist(err);
      should.exist(res);
      res.should.have.property('header');
      res.should.have.property('payload');
      res.payload.data.should.equal(payload.data);
    });
  });
  it('should throw when verification fails', async () => {
    async function signFn({data}) {
      return hmac.sign({data});
    }
    const jwt = await JWT.sign({payload, header, signFn});

    // eslint-disable-next-line no-unused-vars
    async function verifyFn({alg, kid, data, signature}) {
      alg.should.equal(header.alg);
      kid.should.equal(header.kid);

      return false;
    }

    let res;
    let err;
    try {
      res = await JWT.verify({jwt, verifyFn});
    } catch(e) {
      err = e;
    }

    should.exist(err);
    should.not.exist(res);
    const errMsg = 'Failed to verify signature.';
    err.message.should.contain(errMsg);
  });
  it('should fail to verify w/ a malformed "jwt"', async () => {
    async function verifyFn({alg, kid, data, signature}) {
      alg.should.equal(header.alg);
      kid.should.equal(header.kid);

      return hmac.verify({data, signature});
    }

    let res;
    let err;
    try {
      const jwt = 'this is not a JWT';
      res = await JWT.verify({jwt, verifyFn});
    } catch(e) {
      err = e;
    }

    should.exist(err);
    should.not.exist(res);
    const errMsg = 'The "jwt" is invalid.';
    err.message.should.contain(errMsg);
  });
  it('should fail to verify w/ a malformed "verifyFn"', async () => {
    async function signFn({data}) {
      return hmac.sign({data});
    }
    const jwt = await JWT.sign({payload, header, signFn});

    const verifyFn = 'this should be a function';

    let res;
    let err;
    try {
      res = await JWT.verify({jwt, verifyFn});
    } catch(e) {
      err = e;
    }

    should.exist(err);
    should.not.exist(res);
    const errMsg = 'A verify function "verifyFn" must be specified.';
    err.message.should.contain(errMsg);
  });
});
