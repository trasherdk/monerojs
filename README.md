# Node.js Monero Library

[//]: # (**NOTE:** due to the existence of the `monero-nodejs` package by PsychicCat at https://github.com/PsychicCat/monero-nodejs , `moneronodejs` will never be publishable on npm.  Thus, this repository is being finalized, archived, and continued as `monerojs` at https://github/com/sneurlax/monerojs.  If the Monero Integrations team will merge this into monero-ingtegrations/monerojs https://github.com/monero-integrations/monerojs then it will be revived and updated as needed, otherwise please refer to `monerojs` https://github.com/sneurlax/monerojs for the latest code and best features.)

## How It Works
This library has two main parts: a Monero daemon (`monerod`) JSON-RPC API wrapper, `daemonRPC.js`, and a Monero wallet (`monero-wallet-rpc`) JSON RPC API wrapper, `walletRPC.js`.

## Configuration
### Requirements
 - Node.js

*Monero daemon now optional!*

## Installation
```bash
npm install moneronodejs
```
*`--save` optional*

## Usage

This library makes heavy use of promises. Monero daemon and wallet JSON-RPC interfaces their methods return promises.

#### Autoconnect to Monero daemon (`monerod`)

```js
const Monero = require('moneronodejs');

var daemonRPC = new Monero.daemonRPC({ autoconnect: true })
.then((daemon) => {
  daemonRPC = daemon; // Store daemon interface in global variable
  
  daemonRPC.getblockcount()
    .then(blocks => {
      console.log(blocks);
    });
  })
  .catch((err) => {
    console.error(err);
  });
```

#### Connect to specific Monero daemons

```js
// const daemonRPC = new Monero.daemonRPC().then(...).catch(...); // Connect with defaults
// const daemonRPC = new Monero.daemonRPC('127.0.0.1', 28081, 'user', 'pass', 'http').then(...).catch(...); // Example of passing in parameters
// const daemonRPC = new Monero.daemonRPC({ port: 28081, protocol: 'https').then(...).catch(...); // Parameters can be passed in as an object/dictionary
const daemonRPC = new Monero.daemonRPC({ hostname: '127.0.0.1', port: 28081 })
.then(daemon => {
  daemonRPC = daemon; // Store daemon interface in global variable

  daemonRPC.getblockcount()
  .then(height => {
    console.log(height);
  });
})
.catch(err => {
  throw new Error(err);
});
```

#### Connect to Monero wallet (`monero-wallet-rpc`)

```js
// const walletRPC = new Monero.walletRPC('127.0.0.1', 28083, 'user', 'pass', 'http').then(...).catch(...); // Example of passing in parameters
// const walletRPC = new Monero.walletRPC({ port: 28083, protocol: 'https').then(...).catch(...); // Parameters can be passed in as an object/dictionary
const walletRPC = new Monero.walletRPC() // Connect with defaults
.then(wallet => {
  walletRPC = wallet; // Store wallet interface in global variable

  walletRPC.create_wallet('monero_wallet', '')
  .then(new_wallet => {
    walletRPC.open_wallet('monero_wallet', '')
    .then(wallet => {
      walletRPC.getaddress()
      .then(balance => {
        console.log(balance);
      });
    });
  });
})
.catch(err = {
  console.error(err);
});
```

#### Check if Monero wallet is available (running)

```js
var checkForLocalWalletRPC = new Monero.walletRPC({ initialize: false })
.then(() => {
  console.log('monero-wallet-rpc available');
})
.catch(error => {
  console.error('monero-wallet-rpc is unavailable')
});
```
