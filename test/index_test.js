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

        describe('get_outs()', () => {
          it('should get output info', done => {
            daemonRPC.get_outs([{ index: 77777 }])
            .then(result => {
              result.should.be.a.Object();
              result.outs.should.be.a.Array();
              result.outs[0].should.be.a.Object();
              result.outs[0].key.should.be.a.String();
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

        describe('getheight()', () => {
          it('should get node\'s current height', done => {
            daemonRPC.getheight()
            .then(result => {
              result.should.be.a.String();
              JSON.parse(result).should.be.a.Object();
              JSON.parse(result).height.should.be.a.Number();
            })
            .then(done, done);
          });
        });

        describe('gettransactions()', () => {
          it('should get transaction info', done => {
            daemonRPC.gettransactions(['99a992675f1204ea114e1ad14f2e622554f46b3a9cacc91c6255b789906269d5'])
            .then(result => {
              result.should.be.a.Object();
              result.txs.should.be.a.Array();
              result.txs[0].should.be.a.Object();
              result.txs[0].block_height.should.be.a.Number();
              result.txs[0].block_height.should.be.equal(42069);
            })
            .then(done, done);
          });
        });

        describe('get_alt_blocks_hashes()', () => {
          it('should get orphaned block hashes', done => {
            daemonRPC.get_alt_blocks_hashes()
            .then(result => {
              result.should.be.a.String();
              JSON.parse(result).should.be.a.Object();
              JSON.parse(result).blks_hashes.should.be.a.Array();
            })
            .then(done, done);
          });
        });

        describe('is_key_image_spent()', () => {
          it('should get spend status of key image', done => {
            daemonRPC.is_key_image_spent(['8d1bd8181bf7d857bdb281e0153d84cd55a3fcaa57c3e570f4a49f935850b5e3'])
            .then(result => {
              result.should.be.a.Object();
              result.spent_status.should.be.a.Array();
              result.spent_status[0].should.be.a.Number();
              result.spent_status[0].should.be.equal(1);
            })
            .then(done, done);
          });
        });

        // TODO test send_raw_transaction
        // TODO test start_mining
        // TODO test stop_mining
        // TODO test mining_status
        // TODO test save_bc
        // TODO test get_peer_list
        // TODO test set_log_hash_rate
        // TODO test set_log_level
        // TODO test set_log_categories

        describe('get_transaction_pool()', () => {
          it('should get transaction pool info', done => {
            daemonRPC.get_transaction_pool()
            .then(result => {
              result.should.be.a.String();
              // TODO parse JSON
              // JSON.parse(result).should.be.a.Object();
              // JSON.parse(result).key.should.be.a.String();
            })
            .then(done, done);
          });
        });

        describe('get_transaction_pool_stats()', () => {
          it('should get transaction pool stats', done => {
            daemonRPC.get_transaction_pool_stats()
            .then(result => {
              result.should.be.a.String();
              // TODO parse JSON
              // JSON.parse(result).should.be.a.Object();
              // JSON.parse(result).pool_stats.should.be.a.Object();
              // JSON.parse(result).pool_stats.txs_total.should.be.a.Number();
              // JSON.parse(result).pool_stats.histo.should.be.a.String();
            })
            .then(done, done);
          });
        });

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

        describe('get_limit()', () => {
          it('should get daemon bandwidth limits', done => {
            daemonRPC.get_limit()
            .then(result => {
              JSON.parse(result).should.be.a.Object();
              JSON.parse(result).limit_down.should.be.a.Number();
            })
            .then(done, done);
          });
        });

        describe('set_limit()', () => {
          it('should set daemon bandwidth limits', done => {
            daemonRPC.set_limit(-1, -1)
            .then(result => {
              JSON.parse(result).should.be.a.Object();
              JSON.parse(result).limit_down.should.be.a.Number();
            })
            .then(done, done);
          });
        });

        describe('get_outs()', () => {
          it('should get output info', done => {
            daemonRPC.get_outs([{ index: 77777 }])
            .then(result => {
              result.should.be.a.Object();
              result.outs.should.be.a.Array();
              result.outs[0].should.be.a.Object();
              result.outs[0].key.should.be.a.String();
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
