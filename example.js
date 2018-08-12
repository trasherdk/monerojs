// const Monero = require('moneronodejs'); // Used when accessing class outside of library
const Monero = require('./index.js'); // Used when accessing class from within library

// Autoconnect asynchronously (with a promise)
var daemonRPC = new Monero.daemonRPC({ autoconnect: true, random: true })
.then(daemon => {
  daemonRPC = daemon; // Store daemon interface in global variable
  
  daemonRPC.getblockcount()
  .then(blocks => {
    console.log(`Block count: ${blocks['count'] - 1}`);
  });
})
.catch(err => {
  console.error(err);
});

var checkForLocalWalletRPC = new Monero.walletRPC({ initialize: false }) // Check if monero-wallet-rpc if available
.then(() => {
  // monero-wallet-rpc available
  const walletRPC = new Monero.walletRPC()
  .then(wallet => {
    walletRPC = wallet; // Store wallet interface in global variable


  })
  .catch(err => {
    console.error(err);
  });

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
.catch(err => {
  // monero-wallet-rpc unavailable
  console.error('monero-wallet-rpc is not running')
});
