'use strict';
var Monero = require('../index.js');

let network = 'testnet'; // Network to test

// TODO do not test block heights over max block height of current network/node
/*
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
          let hash = '';
          if (network == 'mainnet') {
            hash = '4aff3d3f2a939ddf7c971b57b428841bccde6dc937404346398c4133ba37359b';
          } else if (network == 'testnet') {
            hash = '695d716a064ddd9e7b46e7f1fb5dc78285dd8c37ac91b5801e5f32f230bc7f1f';
          } else if (network == 'stagenet') {
            hash = 'e5e89dc38d1ed8de28f573fdcdffb95c0d6dd9ce5f49a4edc78c88a4cafe66ca';
          }

          it('should return the block 42069\'s hash', done => {
            daemonRPC.on_getblockhash(42069)
            .then(result => {
              // Why no status string?
              result.should.be.a.String();
              result.should.be.equal(hash);
            })
            .then(done, done);
          });
        });

        describe('getblocktemplate()', () => {
          let address = '';
          if (network == 'mainnet') {
            address = '44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A';
          } else if (network == 'testnet') {
            address = '9sykYqd8soGa9Fv8zDMdt2gN8z2Aj5qQeBNpXjxRowkyCoWCYxa3xumYQe5MmQJuFN5CVTQwK2gqtfBNsFqa16gp1L4uGBU';
          } else if (network == 'stagenet') {
            address = '56Gpz2CeLbq1KT6eTHCqH43StT8kh7WQs9ji8wmECS7WUAx85FHrRztebp48wgEt6kcRbTpvBhnktEyDHVhe7xjbTAzALiY';
          }

          it('should return a block template', done => {
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
          let hash = '';
          if (network == 'mainnet') {
            hash = '3b380d7dac4fe41864fe2fc4b7ef7b2e70575d4d847d1f590550b88dc2e9fdf9';
          } else if (network == 'testnet') {
            hash = '3fd46824b2a1143b72fcb1eed9294c817ab37a3ae607d72f85d7021bb7470f19';
          } else if (network == 'stagenet') {
            hash = '48734337ca1bd5a21dd46ac67307af9a18ea838041c85efc0d0ecc91fc285006';
          }

          it('should return block 31337\'s header', done => {
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

        describe('getblockheadersrange()', () => {
          let height = 0;
          let hash1 = '';
          let hash2 = '';
          if (network == 'mainnet') {
            height = 1020304;
            hash1 = 'bb3096056f16f7a439b73980f85ac21285f49eb888346447616ec1eff0e7ae63';
            hash2 = '0027413cb75c9fe737ce45d8a157679e480e967c2ae69d616b5f24be9c997e3b';
          } else if (network == 'testnet') {
            height = 10203;
            hash1 = '6d08e01524fe6f93eb694ec534145d732fa5ac06d504dbcf61056d33e67e6001';
            hash2 = '7d0f8b2b38b43cb6cc47eb0dcff42d4780e20dbc12b32432c1d5f166f5c48d8b';
          } else if (network == 'stagenet') {
            height = 102;
            hash1 = 'c0cf8bbff7bf84f1efa448394bd64b52a36f9f30ff56efb2f6c0302f7680ee3e';
            hash2 = 'cb876ef4fda2057c41b8a484464d26b4c525b3db3d0051476681732940ad2890';
          }

          it(`should return block headers from blocks ${height} to ${height+1}`, done => {
            daemonRPC.getblockheadersrange(height, height+1)
            .then(result => {
              result.should.be.a.Object();
              result.status.should.be.a.String();
              result.status.should.be.equal('OK');
              result.headers.should.be.a.Array();
              result.headers[0].should.be.a.Object();
              result.headers[0].hash.should.be.a.String();
              // result.headers[0].hash.should.be.equal(hash);
              result.headers[0].nonce.should.be.a.Number();
              result.headers[1].should.be.a.Object();
              result.headers[1].hash.should.be.a.String();
              // result.headers[1].hash.should.be.equal(hash);
              result.headers[1].nonce.should.be.a.Number();
            })
            .then(done, done);
          });
        });

        describe('getblock_by_hash()', () => {
          let hash = '';
          if (network == 'mainnet') {
            hash = '5ab00b5f78f731a64ace5558c909cf2d74021d41218021806845197107c6709a';
          } else if (network == 'testnet') {
            hash = '5366843859002d2529fdf9e220be4e67e89ae5406f3effebe4b4ba6872700778';
          } else if (network == 'stagenet') {
            hash = '6dee4fedc89d31ac93302fe7732010e2d12445756808855450c57ee59f853b0d';
          }

          it('should return block 101010', done => {
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
          let hash = '';
          if (network == 'mainnet') {
            hash = 'b137c1d3f3a120635f4824b1f2584571cd9c6d702eba778749d99bce126a244b';
          } else if (network == 'testnet') {
            hash = 'bd56249118d28c35d81195ab7d946ee2648989b32d7902367681266f68db3e92';
          } else if (network == 'stagenet') {
            hash = '6db64a6a8d05e76ce033ccf89320755115b631e512a82dab35f9eefc287c3155';
          }

          it('should return block 20202', done => {
            daemonRPC.getblock_by_height(20202)
            .then(result => {
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
          let txid = '';
          if (network == 'mainnet') {
            txid = '99a992675f1204ea114e1ad14f2e622554f46b3a9cacc91c6255b789906269d5';
          } else if (network == 'testnet') {
            txid = '0f9be746e4112bc94ad281ab354f5b383e4f13a3d12bf27c39fc24339a8298a6';
          } else if (network == 'stagenet') {
            txid = '8da67f5a0c0a32f04b457911a5d47cd65922fe2d077d481cba261c866e0b3b4f';
          }

          it('should get transaction info', done => {
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

        if (daemonRPC['local']) { // Only run the following tests on a local daemon
          describe('get_connections()', () => {
            it('should get remote daemon connections', done => {
              daemonRPC.get_connections()
              .then(result => {
                result.should.be.a.Object();
                result.status.should.be.a.String();
                result.status.should.be.equal('OK');
                result.connections.should.be.a.Array();
                result.connections[0].should.be.a.Object();
                result.connections[0].address.should.be.a.String();
                result.connections[0].height.should.be.a.Number();
              })
              .then(done, done);
            });
          });

          describe('start_mining()', () => {
            let address = '';
            if (network == 'mainnet') {
              address = '44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A';
            } else if (network == 'testnet') {
              address = '9sykYqd8soGa9Fv8zDMdt2gN8z2Aj5qQeBNpXjxRowkyCoWCYxa3xumYQe5MmQJuFN5CVTQwK2gqtfBNsFqa16gp1L4uGBU';
            } else if (network == 'stagenet') {
              address = '56Gpz2CeLbq1KT6eTHCqH43StT8kh7WQs9ji8wmECS7WUAx85FHrRztebp48wgEt6kcRbTpvBhnktEyDHVhe7xjbTAzALiY';
            }

            it('should start mining', done => {
              daemonRPC.start_mining(false, false, address, 2)
              .then(result => {
                result.should.be.a.Object();
                result.status.should.be.a.String();
                result.status.should.be.equal('OK');
              })
              .then(done, done);
            });
          });

          describe('mining_status()', () => {
            it('should stop mining', done => {
              daemonRPC.mining_status()
              .then(result => {
                result.should.be.a.Object();
                result.status.should.be.a.String();
                result.status.should.be.equal('OK');
                result.speed.should.be.a.Number();
              })
              .then(done, done);
            });
          });

          describe('set_log_hash_rate()', () => {
            it('should set hash rate log dislay mode', done => {
              daemonRPC.set_log_hash_rate(true)
              .then(result => {
                result.should.be.a.Object();
                result.status.should.be.a.String();
                result.status.should.be.equal('OK'); // TODO Allow for 'NOT MINING' if not mining
              })
              .then(done, done);
            });
          });

          describe('stop_mining()', () => {
            it('should stop mining', done => {
              daemonRPC.stop_mining()
              .then(result => {
                result.should.be.a.Object();
                result.status.should.be.a.String();
                result.status.should.be.equal('OK');
              })
              .then(done, done);
            });
          });

          describe('save_bc()', () => {
            it('should save blockchain', done => {
              daemonRPC.save_bc()
              .then(result => {
                result.should.be.a.Object();
                result.status.should.be.a.String();
                result.status.should.be.equal('OK');
              })
              .then(done, done);
            });
          });

          describe('get_peer_list()', () => {
            it('should get peer list', done => {
              daemonRPC.get_peer_list()
              .then(result => {
                result.should.be.a.Object();
                result.status.should.be.a.String();
                result.status.should.be.equal('OK');
                result.gray_list.should.be.a.Array();
                result.gray_list[0].should.be.a.Object();
                result.gray_list[0].id.should.be.a.Number();
                result.white_list.should.be.a.Array();
                result.white_list[0].should.be.a.Object();
                result.white_list[0].id.should.be.a.Number();
              })
              .then(done, done);
            });
          });

          describe('set_log_level()', () => {
            it('should set log verbosity', done => {
              daemonRPC.set_log_level(0)
              .then(result => {
                result.should.be.a.Object();
                result.status.should.be.a.String();
                result.status.should.be.equal('OK');
              })
              .then(done, done);
            });
          });

          describe('set_log_categories()', () => {
            it('should set log categories', done => {
              daemonRPC.set_log_categories('*:WARNING')
              .then(result => {
                result.should.be.a.Object();
                result.status.should.be.a.String();
                result.status.should.be.equal('OK');
                result.categories.should.be.a.String();
              })
              .then(done, done);
            });
          });

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
        }

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

          // // Make sure to test stop_daemon() last
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
      });
    })
    .catch(error => {
      // TODO handle error
    })
    .then(done, done);
  })
  .timeout(5000);
});
*/
describe('walletRPC constructor', () => {
  it('should connect to wallet', done => {
    var walletRPC = new Monero.walletRPC({ autoconnect: true, network: network, initialize: false })
    .then(wallet => {
      wallet.should.be.a.Object();

      walletRPC = wallet; // Store daemon interface in global variable

      describe('walletRPC methods', () => {
        describe('create_wallet()', () => {
          it(`should create a new wallet ${network}_wallet (unless it exists)`, done => {
            walletRPC.create_wallet(`${network}_wallet`)
            .then(result => {
              result.should.be.a.Object();
              if (result.hasOwnProperty('error')) {
                if (result.hasOwnProperty('error')) {
                  if (result.error.code == -21) {
                    result.error.code.should.be.equal(-21);
                  }
                }
              } else {
                result.status.should.be.a.String();
                result.status.should.be.equal('OK');
              }
            })
            .then(done, done);
          });
        });

        describe('open_wallet()', () => {
          it(`should open ${network}_wallet`, done => {
            walletRPC.open_wallet(`${network}_wallet`)
            .then(result => {
              result.should.be.a.Object();
            })
            .then(done, done);
          });
        });

        describe('getbalance()', () => {
          it('should retrieve the account balance', done => {
            walletRPC.getbalance()
            .then(result => {
              result.should.be.a.Object();
              result.balance.should.be.a.Number();
            })
            .then(done, done);
          });
        });

        describe('getaddress()', () => {
          it('should return the account address', done => {
            walletRPC.getaddress()
            .then(result => {
              result.should.be.a.Object();
              result.address.should.be.a.String();
            })
            .then(done, done);
          });
        });

        let address_index = 0;

        describe('create_address()', () => {
          it('should create new subaddress', done => {
            walletRPC.create_address(0, 'monerojs unit test suite')
            .then(result => {
              result.should.be.a.Object();
              result.address.should.be.a.String();
              result.address_index.should.be.a.Number();
              address_index = result.address_index;
            })
            .then(done, done);
          });
        });

        describe('label_address()', () => {
          it('should set address label', done => {
            walletRPC.label_address({ major: 0, minor: address_index }, 'monerojs unit test suite subaddress label')
            .then(result => {
              result.should.be.a.Object();
            })
            .then(done, done);
          });
        });

        describe('get_accounts()', () => {
          it('should get wallet accounts', done => {
            walletRPC.get_accounts()
            .then(result => {
              result.should.be.a.Object();
              result.subaddress_accounts.should.be.a.Array();
              result.subaddress_accounts[0].account_index.should.be.a.Number();
            })
            .then(done, done);
          });
        });

        let account_index = 0;

        describe('create_account()', () => {
          it('should create new account', done => {
            walletRPC.create_account('monerojs unit test suite')
            .then(result => {
              result.should.be.a.Object();
              result.address.should.be.a.String();
              result.account_index.should.be.a.Number();
              account_index = result.account_index;
            })
            .then(done, done);
          });
        });

        describe('label_account()', () => {
          it('should label wallet account', done => {
            walletRPC.label_account(account_index, 'monerojs unit test suite account label')
            .then(result => {
              result.should.be.a.Object();
            })
            .then(done, done);
          });
        });

        describe('tag_accounts()', () => {
          it('should tag wallet account', done => {
            walletRPC.tag_accounts([account_index], 'monerojs unit test suite account tag')
            .then(result => {
              result.should.be.a.Object();
            })
            .then(done, done);
          });
        });

        describe('get_account_tags()', () => {
          it('should get account tags', done => {
            walletRPC.get_account_tags(1)
            .then(result => {
              result.should.be.a.Object();
              result.account_tags.should.be.a.Array();
            })
            .then(done, done);
          });
        });

        describe('untag_accounts()', () => {
          it('should untag wallet account', done => {
            walletRPC.tag_accounts([account_index])
            .then(result => {
              result.should.be.a.Object();
            })
            .then(done, done);
          });
        });

        describe('set_account_tag_description()', () => {
          it('should add a description to the wallet account tag', done => {
            walletRPC.set_account_tag_description('monerojs unit test suite account tag', 'monerojs unit test suite account tag description')
            .then(result => {
              result.should.be.a.Object();
            })
            .then(done, done);
          });
        });

        describe('get_height()', () => {
          it('should get wallet height', done => {
            walletRPC.get_height()
            .then(result => {
              result.should.be.a.Object();
              result.height.should.be.a.Number();
            })
            .then(done, done);
          });
        });

        describe('query_key()', () => {
          it('should get wallet view key', done => {
            walletRPC.query_key('view_key')
            .then(result => {
              result.should.be.a.Object();
              result.key.should.be.a.String();
              // TODO test that key is valid
            })
            .then(done, done);
          });
          it('should get wallet spend key', done => {
            walletRPC.query_key('spend_key')
            .then(result => {
              result.should.be.a.Object();
              result.key.should.be.a.String();
              // TODO test that key is valid
            })
            .then(done, done);
          });
          it('should get wallet mnemonic', done => {
            walletRPC.query_key('mnemonic')
            .then(result => {
              result.should.be.a.Object();
              result.key.should.be.a.String();
              // TODO test that mnemonic is valid
            })
            .then(done, done);
          });
        });

        describe('view_key()', () => {
          it('should get wallet view key', done => {
            walletRPC.view_key()
            .then(result => {
              result.should.be.a.Object();
              result.key.should.be.a.String();
              // TODO test that key is valid
            })
            .then(done, done);
          });
        });

        describe('spend_key()', () => {
          it('should get wallet spend key', done => {
            walletRPC.spend_key()
            .then(result => {
              result.should.be.a.Object();
              result.key.should.be.a.String();
              // TODO test that key is valid
            })
            .then(done, done);
          });
        });

        describe('mnemonic()', () => {
          it('should get wallet mnemonic', done => {
            walletRPC.mnemonic()
            .then(result => {
              result.should.be.a.Object();
              result.key.should.be.a.String();
              // TODO test that mnemonic is valid
            })
            .then(done, done);
          });
        });
      });
    })
    .then(done, done);
  });
})
.timeout(5000);
