'use strict';
var Monero = require('../index.js');

describe('remote nodes', () => {
  const daemons = require('../lib/remote-daemons.json');

  for (let i in daemons) {
    let daemon = daemons[i];

    it(`should connect to daemon at ${daemon['hostname']}`, done => {
      let daemonRPC = new Monero.daemonRPC(daemon) // Check if remote daemon is available
      .then(daemon => {
        daemon.should.be.a.Object();
        // monero-wallet-rpcremote daemon available
        done();
      })
      .catch(err => {
        // remote daemon unavailable
      })
      .then(done, done);
    })
    .timeout(5000);
  }
});

describe('daemonRPC constructor', () => {
  it('should autoconnect to daemon', done => {
    var daemonRPC = new Monero.daemonRPC({ autoconnect: true, random: true })
    .then(daemon => { // TODO add type for daemon
      daemon.should.be.a.Object();

      daemonRPC = daemon; // Store daemon interface in global variable

      describe('daemonRPC methods', () => {
        describe('getblockcount()', () => {
          it('should return the node\'s block height', done => {
            daemonRPC.getblockcount()
            .then(result => {
              if (result.hasOwnProperty('error')) {
                if (result.hasOwnProperty('error')) {
                  if (result.error.code == -21) {
                    result.error.code.should.be.equal(-21)
                  }
                }
              } else {
                result.should.be.a.Object();
              }
            })
            .then(done, done);
          });
        });

        describe('on_getblockhash()', () => {
          it('should return the block 42069\'s hash', done => {
            daemonRPC.on_getblockhash(42069)
            .then(result => {
              result.should.be.a.String();
              result.should.be.equal('4aff3d3f2a939ddf7c971b57b428841bccde6dc937404346398c4133ba37359b');
            })
            .then(done, done);
          });
        });
      });
    })
    .catch(error => {
      // TODO handle error
    })
    .then(done, done);
  })
  .timeout(5000);
});

// Only test monero-wallet-rpc if available
var checkForLocalWalletRPC = new Monero.walletRPC({ initialize: false })
.then(wallet => {
  wallet.should.be.a.Object();

  walletRPC = wallet; // Store wallet interface in global variable
  // monero-wallet-rpc available; test
  describe('walletRPC constructor', () => {
    it('should connect to wallet', done => {
      var walletRPC = new Monero.walletRPC();
      walletRPC.should.be.a.Object();
      done();
    });

    describe('walletRPC methods', () => {
      describe('create_wallet()', () => {
        it('should create a new wallet monero_wallet (if monero_wallet doesn\'t exist))', done => {
          walletRPC.create_wallet('monero_wallet').then(result => {
            if (result.hasOwnProperty('error')) {
              if (result.hasOwnProperty('error')) {
                if (result.error.code == -21) {
                  result.error.code.should.be.equal(-21);
                }
              }
            } else {
              result.should.be.a.Object();
            }
            done();
          })
        })
      })

      describe('open_wallet()', () => {
        it('should open monero_wallet', done => {
          walletRPC.open_wallet('monero_wallet').then(result => {
            result.should.be.a.Object();
            done();
          })
        })
      })

      describe('getbalance()', () => {
        it('should retrieve the account balance', done => {
          walletRPC.getbalance().then(result => {
            result.balance.should.be.a.Number();
            done();
          })
        })
      })

      describe('getaddress()', () => {
        it('should return the account address', done => {
          walletRPC.getaddress().then(result => {
            result.address.should.be.a.String();
            done();
          })
        })
      })
    })
  });
})
.catch(error => {
  // monero-wallet-rpc unavailable; report that tests are not possible
  describe('walletRPC constructor', () => {
    it('should not test monero-wallet-rpc unless it is running', done => {
      done();
    });
  });
});
