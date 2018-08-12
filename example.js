// const Monero = require('moneronodejs'); // Used when accessing class outside of library
const Monero = require('./index.js'); // Used when accessing class from within library

// Autoconnect asynchronously (with a promise)
var daemonRPC = new Monero.daemonRPC({ autoconnect: true, random: true })
.then(daemon => {
  daemonRPC = daemon; // Store daemon in global variable
  
  daemonRPC.getblockcount()
  .then(blocks => {
    console.log(`Block count: ${blocks['count'] - 1}`);
  });
})
.catch(error => {
  console.error(error);
});

// Check if monero-wallet-rpc if available
var checkForLocalWalletRPC = new Monero.walletRPC({ test: true })
.then(wallet => { // TODO add type for wallet
  const walletRPC = new Monero.walletRPC();

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
.catch(error => {
  // monero-wallet-rpc unavailable; report that tests are not possible
  console.error('monero-wallet-rpc is not running')
});
