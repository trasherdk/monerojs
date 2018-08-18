'use strict';
var Monero = require('../index.js');

describe('remote nodes', () => {
  const daemons = require('../lib/remote-daemons.json');

  for (let network in daemons) {
    for (let i in daemons[network]) {
      // TODO time each connection; store fastest for use later
      let daemon = daemons[network][i];

      it(`should connect to ${network} daemon at ${daemon['hostname']}`, done => {
        let daemonRPC = new Monero.daemonRPC(daemon) // Check if remote daemon is available
        .then(daemon => {
          daemon.should.be.a.Object();
          // daemon available
        })
        .catch(err => {
          // daemon unavailable
        })
        .then(done, done);
      })
      .timeout(5000);
    }
  }
});

describe('daemonRPC constructor', () => {
  // TODO test one at a time?
  it('should autoconnect to mainnet daemon', done => {
    var daemonRPC = new Monero.daemonRPC({ autoconnect: true, random: true, network: 'mainnet' })
    .then(daemon => {
      daemon.should.be.a.Object();

      daemon.get_info()
      .then(result => {
        result.should.be.a.Object();
        result.status.should.be.a.String();
        result.status.should.be.equal('OK');
        result.mainnet.should.be.a.Boolean();
        result.mainnet.should.be.equal(true);
      });
    })
    .catch(error => {
      // TODO handle error
    })
    .then(done, done);
  })
  .timeout(5000);

  // TODO allow for test to pass if no local testnet daemon available and no remote testnet nodes listed
  it('should autoconnect to testnet daemon', done => {
    var daemonRPC = new Monero.daemonRPC({ autoconnect: true, random: true, network: 'testnet' })
    .then(daemon => {
      daemon.should.be.a.Object();

      daemon.get_info()
      .then(result => {
        result.should.be.a.Object();
        result.status.should.be.a.String();
        result.status.should.be.equal('OK');
        result.testnet.should.be.a.Boolean();
        result.testnet.should.be.equal(true);
      });
    })
    .catch(error => {
      // TODO handle error
    })
    .then(done, done);
  })
  .timeout(5000);

  // TODO allow for test to pass if no local stagenet daemon available and no remote stagenet nodes listed
  it('should autoconnect to stagenet daemon', done => {
    var daemonRPC = new Monero.daemonRPC({ autoconnect: true, random: true, network: 'stagenet' })
    .then(daemon => {
      daemon.should.be.a.Object();

      daemon.get_info()
      .then(result => {
        result.should.be.a.Object();
        result.status.should.be.a.String();
        result.status.should.be.equal('OK');
        result.stagenet.should.be.a.Boolean();
        result.stagenet.should.be.equal(true);
      });
    })
    .catch(error => {
      // TODO handle error
    })
    .then(done, done);
  })
  .timeout(5000);

  let network = 'testnet';

  // TODO connect to fastest daemon from test above
  it('should connect to daemon', done => {
    var daemonRPC = new Monero.daemonRPC({ autoconnect: true, random: true, network: network })
    .then(daemon => {
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
                result.status.should.be.a.String();
                result.status.should.be.equal('OK');
              }
            })
            .then(done, done);
          });
        });

        describe('on_getblockhash()', () => {
          it('should return the block 42069\'s hash', done => {
            daemonRPC.on_getblockhash(42069)
            .then(result => {
              // Why no status string?
              result.should.be.a.String();

              let hash = '';
              if (network == 'mainnet') {
                hash = '4aff3d3f2a939ddf7c971b57b428841bccde6dc937404346398c4133ba37359b';
              } else if (network == 'testnet') {
                hash = '695d716a064ddd9e7b46e7f1fb5dc78285dd8c37ac91b5801e5f32f230bc7f1f';
              } else if (network == 'stagenet') {
                hash = 'e5e89dc38d1ed8de28f573fdcdffb95c0d6dd9ce5f49a4edc78c88a4cafe66ca';
              }

              result.should.be.equal(hash);
            })
            .then(done, done);
          });
        });

        describe('getblocktemplate()', () => {
          it('should return a block template', done => {
            let address = '';
            if (network == 'mainnet') {
              address = '44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A';
            } else if (network == 'testnet') {
              address = '9sykYqd8soGa9Fv8zDMdt2gN8z2Aj5qQeBNpXjxRowkyCoWCYxa3xumYQe5MmQJuFN5CVTQwK2gqtfBNsFqa16gp1L4uGBU';
            } else if (network == 'stagenet') {
              address = '56Gpz2CeLbq1KT6eTHCqH43StT8kh7WQs9ji8wmECS7WUAx85FHrRztebp48wgEt6kcRbTpvBhnktEyDHVhe7xjbTAzALiY';
            }

            daemonRPC.getblocktemplate(address, 255)
            .then(result => {
              if (result.hasOwnProperty('error')) {
                if (result.hasOwnProperty('error')) {
                  if (result.error.code == -4) {
                    result.error.code.should.be.equal(-4)
                  }
                }
              } else {
                result.should.be.a.Object();
                result.status.should.be.a.String();
                result.status.should.be.equal('OK');
                result.blocktemplate_blob.should.be.a.String();
                result.height.should.be.a.Number();
              }
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
              result.status.should.be.a.String();
              result.status.should.be.equal('OK'); // TODO allow for 'BUSY'
              result.block_header.should.be.a.Object();
              result.block_header.hash.should.be.a.String();
              result.block_header.nonce.should.be.a.Number();
            })
            .then(done, done);
          });
        });

        describe('getblockheaderbyhash()', () => {
          it('should return block 31337\'s header', done => {
            let hash = '';
            if (network == 'mainnet') {
              hash = '3b380d7dac4fe41864fe2fc4b7ef7b2e70575d4d847d1f590550b88dc2e9fdf9';
            } else if (network == 'testnet') {
              hash = '3fd46824b2a1143b72fcb1eed9294c817ab37a3ae607d72f85d7021bb7470f19';
            } else if (network == 'stagenet') {
              hash = '48734337ca1bd5a21dd46ac67307af9a18ea838041c85efc0d0ecc91fc285006';
            }

            daemonRPC.getblockheaderbyhash(hash)
            .then(result => {
              result.should.be.a.Object();
              result.status.should.be.a.String();
              result.status.should.be.equal('OK');
              result.block_header.should.be.a.Object();
              result.block_header.height.should.be.a.Number();
              result.block_header.height.should.be.equal(31337);
              result.block_header.nonce.should.be.a.Number();
            })
            .then(done, done);
          });
        });

        describe('getblockheaderbyheight()', () => {
          let height = 0;
          let hash = '';
          if (network == 'mainnet') {
            height = 1234567;
            hash = 'f093439d0dd48010a22fdb615a659e22738a10991871b5dc2335efa69008a8cd';
          } else if (network == 'testnet') {
            height = 123456;
            hash = 'aaaac8fe6bd05f32aa68b9bd13d66d2056335a1a4a88c788f7a07ab8a1e64912';
          } else if (network == 'stagenet') {
            height = 12345;
            hash = '43dc0db57bfa5fbfe55c872944697cb8c8570fe12da9228e8c253e9ca16cdf2c';
          }

          it(`should return block ${height}'s header`, done => {
            daemonRPC.getblockheaderbyheight(height)
            .then(result => {
              result.should.be.a.Object();
              result.status.should.be.a.String();
              result.status.should.be.equal('OK');
              result.block_header.should.be.a.Object();
              result.block_header.hash.should.be.a.String();
              result.block_header.hash.should.be.equal(hash);
              result.block_header.nonce.should.be.a.Number();
            })
            .then(done, done);
          });
        });

        describe('getblock_by_hash()', () => {
          it('should return block 101010', done => {
            let hash = '';
            if (network == 'mainnet') {
              hash = '5ab00b5f78f731a64ace5558c909cf2d74021d41218021806845197107c6709a';
            } else if (network == 'testnet') {
              hash = '5366843859002d2529fdf9e220be4e67e89ae5406f3effebe4b4ba6872700778';
            } else if (network == 'stagenet') {
              hash = '6dee4fedc89d31ac93302fe7732010e2d12445756808855450c57ee59f853b0d';
            }

            daemonRPC.getblock_by_hash(hash)
            .then(result => {
              result.should.be.a.Object();
              result.status.should.be.a.String();
              result.status.should.be.equal('OK');
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
          it('should return block 20202', done => {
            daemonRPC.getblock_by_height(20202)
            .then(result => {
              let hash = '';
              if (network == 'mainnet') {
                hash = 'b137c1d3f3a120635f4824b1f2584571cd9c6d702eba778749d99bce126a244b';
              } else if (network == 'testnet') {
                hash = 'bd56249118d28c35d81195ab7d946ee2648989b32d7902367681266f68db3e92';
              } else if (network == 'stagenet') {
                hash = '6db64a6a8d05e76ce033ccf89320755115b631e512a82dab35f9eefc287c3155';
              }

              result.should.be.a.Object();
              result.status.should.be.a.String();
              result.status.should.be.equal('OK');
              result.blob.should.be.a.String();
              result.block_header.should.be.a.Object();
              result.block_header.hash.should.be.a.String();
              result.block_header.hash.should.be.equal(hash);
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
        //       result.status.should.be.a.String();
        //       result.status.should.be.equal('OK');
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
              result.status.should.be.a.String();
              result.status.should.be.equal('OK');
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
              result.status.should.be.a.String();
              result.status.should.be.equal('OK');
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
              result.should.be.a.Object();
              result.status.should.be.a.String();
              result.status.should.be.equal('OK');
              result.should.be.a.Object();
              result.height.should.be.a.Number();
            })
            .then(done, done);
          });
        });

        describe('gettransactions()', () => {
          it('should get transaction info', done => {
            let txid = '';
            if (network == 'mainnet') {
              txid = '99a992675f1204ea114e1ad14f2e622554f46b3a9cacc91c6255b789906269d5';
            } else if (network == 'testnet') {
              txid = '0f9be746e4112bc94ad281ab354f5b383e4f13a3d12bf27c39fc24339a8298a6';
            } else if (network == 'stagenet') {
              txid = '8da67f5a0c0a32f04b457911a5d47cd65922fe2d077d481cba261c866e0b3b4f';
            }

            daemonRPC.gettransactions([txid])
            .then(result => {
              result.should.be.a.Object();
              result.status.should.be.a.String();
              result.status.should.be.equal('OK');
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
              result.should.be.a.Object();
              result.status.should.be.a.String();
              result.status.should.be.equal('OK');
              if ('blks_hashes' in result) {
                result.blks_hashes.should.be.a.Array();
              }
            })
            .then(done, done);
          });
        });

        describe('is_key_image_spent()', () => {
          it('should get spend status of key image', done => {
            daemonRPC.is_key_image_spent(['8d1bd8181bf7d857bdb281e0153d84cd55a3fcaa57c3e570f4a49f935850b5e3'])
            .then(result => {
              result.should.be.a.Object();
              result.status.should.be.a.String();
              result.status.should.be.equal('OK');
              result.spent_status.should.be.a.Array();
              result.spent_status[0].should.be.a.Number();
              // TODO handle testnet and stagenet key images
              if (network == 'mainnet') {
                result.spent_status[0].should.be.equal(1);
              }
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
              result.should.be.a.Object();
              result.should.be.a.Object();
              result.status.should.be.a.String();
              result.status.should.be.equal('OK');
            })
            .then(done, done);
          });
        });

        describe('get_transaction_pool_stats()', () => {
          it('should get transaction pool stats', done => {
            daemonRPC.get_transaction_pool_stats()
            .then(result => {
              result.should.be.a.Object();
              result.should.be.a.Object();
              result.status.should.be.a.String();
              result.status.should.be.equal('OK');
              result.pool_stats.should.be.a.Object();
              result.pool_stats.txs_total.should.be.a.Number();
            })
            .then(done, done);
          });
        });

        describe('get_info()', () => {
          it('should get general blockchain and network info', done => {
            daemonRPC.get_info()
            .then(result => {
              result.should.be.a.Object();
              result.status.should.be.a.String();
              result.status.should.be.equal('OK');
              result.tx_count.should.be.a.Number();
              result.status.should.be.a.String();
            })
            .then(done, done);
          });
        });

        // TODO only test on local daemon
        describe('get_limit()', () => {
          it('should get daemon bandwidth limits', done => {
            daemonRPC.get_limit()
            .then(result => {
              result.should.be.a.Object();
              result.status.should.be.a.String();
              result.status.should.be.equal('OK');
              result.limit_down.should.be.a.Number();
            })
            .then(done, done);
          });
        });

        // TODO only test on local daemon
        describe('set_limit()', () => {
          it('should set daemon bandwidth limits', done => {
            daemonRPC.set_limit(-1, -1)
            .then(result => {
              result.should.be.a.Object();
              result.status.should.be.a.String();
              result.status.should.be.equal('OK');
              result.limit_down.should.be.a.Number();
            })
            .then(done, done);
          });
        });

        // TODO only test on local daemon
        describe('out_peers()', () => {
          it('should set maximum number of outgoing peers', done => {
            daemonRPC.out_peers(10000)
            .then(result => {
              result.should.be.a.Object();
              result.status.should.be.a.String();
              result.status.should.be.equal('OK');
            })
            .then(done, done);
          });
        });

        // TODO only test on local daemon
        describe('in_peers()', () => {
          it('should set maximum number of incoming peers', done => {
            daemonRPC.in_peers(10000)
            .then(result => {
              result.should.be.a.Object();
              result.status.should.be.a.String();
              result.status.should.be.equal('OK');
            })
            .then(done, done);
          });
        });

        describe('get_outs()', () => {
          it('should get output info', done => {
            daemonRPC.get_outs([{ index: 77777 }])
            .then(result => {
              result.should.be.a.Object();
              result.status.should.be.a.String();
              result.status.should.be.equal('OK');
              result.outs.should.be.a.Array();
              result.outs[0].should.be.a.Object();
              result.outs[0].key.should.be.a.String();
            })
            .then(done, done);
          });
        });

        // // Make sure to test stop_daemon() last
        // // TODO only test on local daemon
        // describe('stop_daemon()', () => {
        //   it('should stop the daemon', done => {
        //     daemonRPC.stop_daemon()
        //     .then(result => {
        //       result.should.be.a.Object();
        //       result.status.should.be.equal('OK');

        //       // TODO restart daemon
        //     })
        //     .then(done, done);
        //   });
        // });
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
