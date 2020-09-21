# Minimal JWT _(minimal-jwt)_

> Minimal signature/verification [JWT](https://tools.ietf.org/html/rfc7519) library

## Table of Contents

- [Security](#security)
- [Install](#install)
- [Usage](#usage)
- [Contribute](#contribute)
- [Commercial Support](#commercial-support)
- [License](#license)

## Security

TBD

## Install

To install locally (for development):

```
git clone https://github.com/digitalbazaar/minimal-jwt.git
cd minimal-jwt
npm install
```

## Usage

### Sign

```js
const JWT = require('minimal-jwt');
const crypto = require('crypto');

const SECRET = '<the-best-kept-secret>';

// create a sign function
async function signFn({data}) {
  return crypto.createHmac('sha256', Buffer.from(SECRET)).update(data).digest();
}


(async function() {
  const header = {alg: 'HS256', kid: '678-999-8212'};
  const payload = {data: 'it was all a dream'};

  const jwt = await JWT.sign({payload, header, signFn});

  // eyJhbGciOiJIUzI1NiIsImtpZCI6IjY3OC05OTktODIxMiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiaXQgd2FzIGFsbCBhIGRyZWFtIn0.z3kOh1ksQl0F-KnbIY38WdjzyEbItrx0oIOLheOrdlU
  console.log(jwt);
})();
```

### Verify


```js
const JWT = require('minimal-jwt');
const crypto = require('crypto');

const EXPECTED_ALGS = new Set(['HS256']);
const EXPECTED_KID = '678-999-8212';
const SECRET = '<the-best-kept-secret>';

(async function() {
  const header = {alg: 'HS256', kid: '678-999-8212'};
  const payload = {data: 'it was all a dream'};

  const jwt = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IjY3OC05OTktODIxMiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiaXQgd2FzIGFsbCBhIGRyZWFtIn0.z3kOh1ksQl0F-KnbIY38WdjzyEbItrx0oIOLheOrdlU';

  const response = await JWT.verify({jwt, verifyFn});

  /*
    {
      header: { alg: 'HS256', kid: '678-999-8212', typ: 'JWT' },
      payload: { data: 'it was all a dream' }
    }
  */
  console.log(response);
})();

// create a verify function
async function verifyFn({alg, kid, data, signature}) {
  if(!EXPECTED_ALGS.has(alg)) {
    throw new Error(`"${alg}" is not supported.`);
  }

  if(alg === 'HS256' && kid === EXPECTED_KID) {
    const expectedSignature = await signFn({data});

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } else {
    throw new Error(`Key "${kid}" is not supported.`);
  }
}
async function signFn({data}) {
  return crypto.createHmac('sha256', Buffer.from(SECRET)).update(data).digest();
}
```

## Contribute

See [the contribute file](https://github.com/digitalbazaar/bedrock/blob/master/CONTRIBUTING.md)!

PRs accepted.

Small note: If editing the README, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## Commercial Support

Commercial support for this library is available upon request from
Digital Bazaar: support@digitalbazaar.com

## License

[New BSD License (3-clause)](LICENSE) © Digital Bazaar
