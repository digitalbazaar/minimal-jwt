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
import * as JWT from '@digitalbazaar/minimal-jwt';
import crypto from 'node:crypto';

const SECRET = '<the-best-kept-secret>';

// create a sign function
async function signFn({data}) {
  return crypto.createHmac('sha256', Buffer.from(SECRET)).update(data).digest();
}

(async function() {
  const header = {alg: 'HS256', kid: '194B72684'};
  const payload = {'example-claim': 'it was all a dream'};

  const jwt = await JWT.sign({payload, header, signFn});

  // eyJhbGciOiJIUzI1NiIsImtpZCI6IjE5NEI3MjY4NCIsInR5cCI6IkpXVCJ9.eyJleGFtcGxlLWNsYWltIjoiaXQgd2FzIGFsbCBhIGRyZWFtIn0.rVh61q6ZJCeS4vj-d8OmFFWnAbt4vcWcoMqHtGlSQ18
  console.log(jwt);
})();

```

### Verify


```js
import * as JWT from '@digitalbazaar/minimal-jwt';
import crypto from 'node:crypto';

const EXPECTED_ALGS = new Set(['HS256']);
const EXPECTED_KID = '194B72684';
const SECRET = '<the-best-kept-secret>';

(async function() {
  const jwt = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IjE5NEI3MjY4NCIsInR5cCI6IkpXVCJ9.eyJleGFtcGxlLWNsYWltIjoiaXQgd2FzIGFsbCBhIGRyZWFtIn0.rVh61q6ZJCeS4vj-d8OmFFWnAbt4vcWcoMqHtGlSQ18';

  const response = await JWT.verify({jwt, verifyFn});

  /*
    {
      header: { alg: 'HS256', kid: '194B72684', typ: 'JWT' },
      payload: { 'example-claim': 'it was all a dream' }
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
