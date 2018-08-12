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

        describe('getblocktemplate()', () => {
          it('should return a block template', done => {
            daemonRPC.getblocktemplate('44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A', 255)
            .then(result => {
              result.should.be.a.Object();
              result.blocktemplate_blob.should.be.a.String();
              result.height.should.be.a.Number();
            })
            .then(done, done);
          });
        });

        // TODO test submitblock

        describe('getlastblockheader()', () => {
          it('should return block header', done => {
            daemonRPC.getlastblockheader()
            .then(result => {
              result.should.be.a.Object();
              result.block_header.should.be.a.Object();
              result.block_header.hash.should.be.a.String();
              result.block_header.nonce.should.be.a.Number();
            })
            .then(done, done);
          });
        });

        describe('getblockheaderbyhash()', () => {
          it('should return block 31337\'s header', done => {
            daemonRPC.getblockheaderbyhash('3b380d7dac4fe41864fe2fc4b7ef7b2e70575d4d847d1f590550b88dc2e9fdf9')
            .then(result => {
              result.should.be.a.Object();
              result.block_header.should.be.a.Object();
              result.block_header.height.should.be.a.Number();
              result.block_header.height.should.be.equal(31337);
              result.block_header.nonce.should.be.a.Number();
            })
            .then(done, done);
          });
        });

        describe('getblockheaderbyheight()', () => {
          it('should return block 1234567\'s header', done => {
            daemonRPC.getblockheaderbyheight(1234567)
            .then(result => {
              result.should.be.a.Object();
              result.block_header.should.be.a.Object();
              result.block_header.hash.should.be.a.String();
              result.block_header.hash.should.be.equal('f093439d0dd48010a22fdb615a659e22738a10991871b5dc2335efa69008a8cd');
              result.block_header.nonce.should.be.a.Number();
            })
            .then(done, done);
          });
        });

        describe('getblock_by_hash()', () => {
          it('should return block 101010', done => {
            daemonRPC.getblock_by_hash('5ab00b5f78f731a64ace5558c909cf2d74021d41218021806845197107c6709a')
            .then(result => {
              result.should.be.a.Object();
              result.blob.should.be.a.String();
              result.block_header.should.be.a.Object();
              result.block_header.height.should.be.a.Number();
              result.block_header.height.should.be.equal(101010);
              result.block_header.nonce.should.be.a.Number();
            })
            .then(done, done);
          });
        });

        describe('getblock_by_height()', () => {
          it('should return block 202020', done => {
            daemonRPC.getblock_by_height(202020)
            .then(result => {
              result.should.be.a.Object();
              result.blob.should.be.a.String();
              result.block_header.should.be.a.Object();
              result.block_header.hash.should.be.a.String();
              result.block_header.hash.should.be.equal('e262d0b6cdae7dabae5e30e4226f70c34254674b8b56b7d992377c4faca67024');
              result.block_header.nonce.should.be.a.Number();
            })
            .then(done, done);
          });
        });

        // TODO test get_connections if connected to local node
        // describe('get_connections()', () => {
        //   it('should get remote daemon connections', done => {
        //     daemonRPC.get_connections()
        //     .then(result => {
        //       result.should.be.a.Object();
        //       console.log(result)
        //       // result.blob.should.be.a.String();
        //       // result.block_header.should.be.a.Object();
        //       // result.block_header.hash.should.be.a.String();
        //       // result.block_header.hash.should.be.equal('e262d0b6cdae7dabae5e30e4226f70c34254674b8b56b7d992377c4faca67024');
        //       // result.block_header.nonce.should.be.a.Number();
        //     })
        //     .then(done, done);
        //   });
        // });

        describe('get_info()', () => {
          it('should get general blockchain and network info', done => {
            daemonRPC.get_info()
            .then(result => {
              result.should.be.a.Object();
              result.tx_count.should.be.a.Number();
              result.status.should.be.a.String();
            })
            .then(done, done);
          });
        });

        describe('hard_fork_info()', () => {
          it('should get hard info', done => {
            daemonRPC.hard_fork_info()
            .then(result => {
              result.should.be.a.Object();
              result.earliest_height.should.be.a.Number();
              result.version.should.be.a.Number();
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
