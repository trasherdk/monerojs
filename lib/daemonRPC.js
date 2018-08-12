/**
 * moneronodejs/daemonRPC
 * 
 * A class for making calls to a Monero daemon's RPC API using Node.js
 * https://github.com/sneurlax/moneronodejs
 * 
 * @author     sneurlax <sneurlax@gmail.com> (https://github.com/sneurlax)
 * @copyright  2018
 * @license    MIT
 */
'use strict'

var request = require('request-promise');

/**
 * @class daemonRPC
 * @param {string} hostname - RPC hostname
 * @param {number} port - RPC port
 * @param {string} user - RPC username
 * @param {string} pass - RPC password
 * @param {string} protocol - RPC protocol
 *
 *   OR
 *
 * @param {object} params - The same parameters above in any order as an object/dictionary
 *
 *   OR
 *
 * @param {object} params - Use autoconnect: true to autoconnect to a daemon from daemons.json and optionally random: true to connect to one randomly
 *
 * @return {promise} resolve, reject
 */
class daemonRPC {
  constructor(hostname = '127.0.0.1', port = 18081, user = undefined, pass = undefined, protocol = 'http') {
    return new Promise((resolve, reject) => {
      this.daemons = require('./remote-daemons.json');

      if (typeof hostname == 'object') { // parameters can be passed in as object/dictionary
        let params = hostname;

        this.hostname = params['hostname'] || '127.0.0.1';
        this.port = params['port'] || port;
        this.user = params['user'] || user;
        this.pass = params['pass'] || pass;
        this.protocol = params['protocol'] || protocol;

        // if ('daemons' in params) {
        //   // TODO set list of daemons from passed parameter, local file import, or HTTP/HTTPS URL
        // }

        if ('autoconnect' in params) {
          if (params['autoconnect']) { // TODO add mainnet/testnet toggle
            if ('random' in params) {
              // Fisher-Yates Shuffle  
              let i = 0,
                  j = 0,
                  temp = null;

              for (i = this.daemons.length - 1; i > 0; i -= 1) {
                j = Math.floor(Math.random() * (i + 1));
                temp = this.daemons[i];
                this.daemons[i] = this.daemons[j];
                this.daemons[j] = temp;
              }
            }

            let daemonsLocal = require('./local-daemons.json'); // local mainnet and testnet daemons
            this.daemons.unshift(...daemonsLocal); // Put common local monerod addresses and ports at the front of the list of daemons to try 
            // TODO add this by default unless eg. --nolocal flag

            // Try the passed daemon first
            if ('hostname' in params) {
              this.daemons.unshift({ hostname: this.hostname, port: this.port, protocol: this.protocol, user: this.user, pass: this.pass });
            }

            return this._autoconnect()
            .then(daemon => { // TODO add type for daemon
              resolve(daemon);
            })
            .catch(err => {
              reject(err);
            });
          }
        }
      } else {
        this.hostname = hostname;
        this.port = port;
        this.user = user;
        this.pass = pass;
        this.protocol = protocol;
      }

      return this._autoconnect([{
        hostname: this.hostname,
        port: this.port,
        user: this.user,
        pass: this.pass,
        protocol: this.protocol
      }])
      .then(daemon => { // TODO add type for daemon
        resolve(daemon);
      })
      .catch(err => {
        reject(err);
      });
    });
  }

  /**
   * Autoconnect to a local or remote daemon
   * 
   * @function _autoconnect
   * @param {array} daemons - Array of daemon objects // TODO add type for daemon object
   *
   * @return {promise} resolve, reject
   */
  _autoconnect(daemons = this.daemons) {
    return new Promise((resolve, reject) => {
      let daemon = daemons.shift();

      this._test(daemon)
      .then(() => {
        this.hostname = daemon.hostname;
        this.port = daemon.port;
        this.protocol = daemon.protocol;
        if ('user' in daemon)
          this.user = user;
        if ('pass' in daemon)
          this.pass = pass;
        resolve(this);
      })
      .catch(() => {
        if (daemons.length > 0) {
          this._autoconnect(daemons)
          .then(daemon => { // TODO add daemon type
            resolve(daemon);
          })
          .catch(err => {
            reject('Failed to autoconnect to daemon', err);
          });
        } else {
          reject('Failed to autoconnect to daemon');
        }
      });
    });
  }

  /**
   * Test a local or remote Monero RPC API for accessibility
   *
   * @function _test
   * @param {string} hostname - RPC hostname
   * @param {string} port - RPC port
   * @param {string} user - RPC user
   * @param {string} pass - RPC pass
   * @param {string} protocol - RPC protocol
   *
   *   OR
   *
   * @param {object} params - The same parameters above in any order as an object/dictionary
   *
   * @return {promise} resolve, reject
   */
  _test(hostname = this.hostname, port = this.port, user = this.user, pass = this.pass, protocol = this.protocol) {
    if (typeof hostname == 'object') {
      let params = hostname;

      hostname = params['hostname'] || this.hostname;
      port = params['port'] || port || this.port;
      user = params['user'] || user || this.user;
      pass = params['pass'] || pass || this.pass;
      protocol = params['protocol'] || protocol || this.protocol;
    }
    let options = {
      json: {
        jsonrpc: '2.0',
        id: '0',
        method: 'getblockcount'
      }
    };

    if (user) {
      options['forever'] = true;
      options['auth'] = {
        user: user,
        pass: pass,
        sendImmediately: false
      };
    }

    return new Promise((resolve, reject) => {
      // console.info(`Testing ${protocol}://${hostname}:${port}...`);
      return request.post(`${protocol}://${hostname}:${port}/json_rpc`, options)
      .then((result) => {
        resolve();
      })
      .catch((error) => {
        reject();
      });
    });
  }

  /**
   * Execute command on the Monero RPC API
   *
   * @function _run
   * @param {string} method - RPC method to call
   * @param {ojbect} params - Options to include (optional)
   *
   * @returns {promise} resolve, reject
   *
   * @resolves {object} - Method result, possibly including error object
   */
  _run(method = null, params = undefined, extension = 'json_rpc') {
    let options = {};

    if (extension == 'json_rpc') { // Standard method
      options = {
        json: {
          jsonrpc: '2.0',
          id: '0',
          method: method,
          params: params
        }
      };
    } else { // "Other" method
      options = {
        json: params
      };
    }

    if (this.user) {
      options['forever'] = true;
      options['auth'] = {
        user: this.user,
        pass: this.pass,
        sendImmediately: false
      };
    }

    return request.post(`${this.protocol}://${this.hostname}:${this.port}/${extension}`, options)
    .then(result => {
      if (result['result']) {
        return result['result'];
      } else {
        return result;
      }
    })
    .catch(err => {
      throw new Error(err);
    });
  }

  /**
   * Look up how many blocks are in the longest chain known to the node
   *
   * @function getblockcount
   *
   * @returns {object} - Example: {  
   *   count: 993163,  
   *   status: "OK"  
   * }  
   */
  getblockcount() {
    return this._run('getblockcount');
  }

  /**
   * Look up a block's hash by its height
   *
   * @function on_getblockhash
   * @param {array} height - Height of block to look up 
   *
   * @return string  Example: '4aff3d3f2a939ddf7c971b57b428841bccde6dc937404346398c4133ba37359b'
   */
  on_getblockhash(height) {
    if (typeof height == 'undefined') {
      throw new Error('Error: Height required');
    }

    let params = [+height];

    return this._run('on_getblockhash', params);
  }

  /**
   * Retrieve a block template that can be mined upon
   *
   * @function getblocktemplate
   * @param {string} wallet_address - Address of wallet to receive coinbase transactions if block is successfully mined
   * @param {int} reserve_size - Reserve size 
   *
   * @returns {object} - Example: {
   *   blocktemplate_blob: "01029af88cb70568b84a11dc9406ace9e635918ca03b008f7728b9726b327c1b482a98d81ed83000000000018bd03c01ffcfcf3c0493d7cec7020278dfc296544f139394e5e045fcda1ba2cca5b69b39c9ddc90b7e0de859fdebdc80e8eda1ba01029c5d518ce3cc4de26364059eadc8220a3f52edabdaf025a9bff4eec8b6b50e3d8080dd9da417021e642d07a8c33fbe497054cfea9c760ab4068d31532ff0fbb543a7856a9b78ee80c0f9decfae01023ef3a7182cb0c260732e7828606052a0645d3686d7a03ce3da091dbb2b75e5955f01ad2af83bce0d823bf3dbbed01ab219250eb36098c62cbb6aa2976936848bae53023c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001f12d7c87346d6b84e17680082d9b4a1d84e36dd01bd2c7f3b3893478a8d88fb3",
   *   difficulty: 982540729,
   *   height: 993231,
   *   prev_hash: "68b84a11dc9406ace9e635918ca03b008f7728b9726b327c1b482a98d81ed830",
   *   reserved_offset: 246,
   *   status: "OK"
   * }
   */
  getblocktemplate(wallet_address, reserve_size) {
    if (typeof wallet_address == 'undefined') {
      throw new Error('Error: Wallet address required');
    }
    if (typeof reserve_size == 'undefined') {
      throw new Error('Error: Reserve size required');
    }
    
    let params = {
      wallet_address: wallet_address,
      reserve_size: reserve_size
    };

    return this._run('getblocktemplate', params);
  }

  /**
   * Submit a mined block to the network
   *
   * @function submitblock
   * @param {string} block - Block blob data string
   *
   * @return string  // TODO: example
   */
  submitblock(block) {
    if (typeof block == 'undefined') {
      throw new Error('Error: Block blob required');
    }

    return this._run('submitblock', block);
  }

  /**
   * Block header information for the most recent block is easily retrieved with this method
   *
   * @function getlastblockheader
   *
   * @returns {object} - Example: {
   *   block_header: {
   *     depth: 0,
   *     difficulty: 746963928,
   *     hash: "ac0f1e226268d45c99a16202fdcb730d8f7b36ea5e5b4a565b1ba1a8fc252eb0",
   *     height: 990793,
   *     major_version: 1,
   *     minor_version: 1,
   *     nonce: 1550,
   *     orphan_status: false,
   *     prev_hash: "386575e3b0b004ed8d458dbd31bff0fe37b280339937f971e06df33f8589b75c",
   *     reward: 6856609225169,
   *     timestamp: 1457589942
   *   },
   *   status: "OK"
   * }
   */
  getlastblockheader() {
    return this._run('getlastblockheader');
  }

  /**
   * Block header information can be retrieved using either a block's hash or height
   *
   * @function getblockheaderbyhash
   * @param {string} hash - The block's SHA256 hash
   *
   * @returns {object} - Example: {
   *   block_header: {
   *     depth: 78376,
   *     difficulty: 815625611,
   *     hash: "e22cf75f39ae720e8b71b3d120a5ac03f0db50bba6379e2850975b4859190bc6",
   *     height: 912345,
   *     major_version: 1,
   *     minor_version: 2,
   *     nonce: 1646,
   *     orphan_status: false,
   *     prev_hash: "b61c58b2e0be53fad5ef9d9731a55e8a81d972b8d90ed07c04fd37ca6403ff78",
   *     reward: 7388968946286,
   *     timestamp: 1452793716
   *   },
   *   status: "OK"
   * }
   */
  getblockheaderbyhash(hash) {
    if (typeof hash == 'undefined') {
      throw new Error('Error: Block hash required');
    }
    
    let params = { hash: hash };

    return this._run('getblockheaderbyhash', params);
  }

  /**
   * Similar to getblockheaderbyhash() above, this method includes a block's height as an input parameter to retrieve basic information about the block
   *
   * @function getblockheaderbyheight
   * @param {int} height - The block's height
   *
   * @returns {object} - Example: {
   *   block_header: {
   *     depth: 78376,
   *     difficulty: 815625611,
   *     hash: "e22cf75f39ae720e8b71b3d120a5ac03f0db50bba6379e2850975b4859190bc6",
   *     height: 912345,
   *     major_version: 1,
   *     minor_version: 2,
   *     nonce: 1646,
   *     orphan_status: false,
   *     prev_hash: "b61c58b2e0be53fad5ef9d9731a55e8a81d972b8d90ed07c04fd37ca6403ff78",
   *     reward: 7388968946286,
   *     timestamp: 1452793716
   *   },
   *   status: "OK"
   * }
   */
  getblockheaderbyheight(height) {
    if (typeof height == 'undefined') {
      throw new Error('Error: Block height required');
    }
    
    let params = { height: +height };

    return this._run('getblockheaderbyheight', params);
  }

  /**
   * Get block information by its SHA256 hash
   *
   * @function getblock_by_hash
   * @param {string} hash - The block's SHA256 hash
   *
   * @returns {object} - Example: {
   *   blob: "...",
   *   block_header: {
   *     depth: 12,
   *     difficulty: 964985344,
   *     hash: "510ee3c4e14330a7b96e883c323a60ebd1b5556ac1262d0bc03c24a3b785516f",
   *     height: 993056,
   *     major_version: 1,
   *     minor_version: 2,
   *     nonce: 2036,
   *     orphan_status: false,
   *     prev_hash: "0ea4af6547c05c965afc8df6d31509ff3105dc7ae6b10172521d77e09711fd6d",
   *     reward: 6932043647005,
   *     timestamp: 1457720227
   *   },
   *   json: "...",
   *   status: "OK"
   * }
   */
  getblock_by_hash(hash) {
    let params = { hash: hash };

    return this._run('getblock', params);
  }

  /**
   * Get block information by its height
   *
   * @function getblock_by_height
   * @param {int} height - The block's height
   *
   * @returns {object} - Example: {
   *   blob: "...",
   *   block_header: {
   *     depth: 80694,
   *     difficulty: 815625611,
   *     hash: "e22cf75f39ae720e8b71b3d120a5ac03f0db50bba6379e2850975b4859190bc6",
   *     height: 912345,
   *     major_version: 1,
   *     minor_version: 2,
   *     nonce: 1646,
   *     orphan_status: false,
   *     prev_hash: "b61c58b2e0be53fad5ef9d9731a55e8a81d972b8d90ed07c04fd37ca6403ff78",
   *     reward: 7388968946286,
   *     timestamp: 1452793716
   *   },
   *   json: "...",
   *   status: "OK"
   * }
   */
  getblock_by_height(height) {
    let params = { height: +height };
    return this._run('getblock', params);
  }

  /**
   * Retrieve information about incoming and outgoing connections to your node
   *
   * @function get_connections
   *
   * @returns {object} - Example: {
   *   connections: [{
   *     avg_download: 0,
   *     avg_upload: 0,
   *     current_download: 0,
   *     current_upload: 0,
   *     incoming: false,
   *     ip: "76.173.170.133",
   *     live_time: 1865,
   *     local_ip: false,
   *     localhost: false,
   *     peer_id: "3bfe29d6b1aa7c4c",
   *     port: "18080",
   *     recv_count: 116396,
   *     recv_idle_time: 23,
   *     send_count: 176893,
   *     send_idle_time: 1457726610,
   *     state: "state_normal"
   *   },{
   *   ..
   *   }],
   *   status: "OK"
   * }
   */
  get_connections() {
    return this._run('get_connections');
  }

  /**
   * Retrieve general information about the state of your node and the network
   *
   * @function get_info
   *
   * @returns {object} - Example: {
   *   alt_blocks_count: 5,
   *   difficulty: 972165250,
   *   grey_peerlist_size: 2280,
   *   height: 993145,
   *   incoming_connections_count: 0,
   *   outgoing_connections_count: 8,
   *   status: "OK",
   *   target: 60,
   *   target_height: 993137,
   *   testnet: false,
   *   top_block_hash: "",
   *   tx_count: 564287,
   *   tx_pool_size: 45,
   *   white_peerlist_size: 529
   * }
   */
  get_info() {
    return this._run('get_info');
  }

  /**
   * Look up information regarding hard fork voting and readiness
   *
   * @function hard_fork_info
   *
   * @returns {object} - Example: {
   *   earliest_height: 1546000,
   *   enabled: true,
   *   state: 2,
   *   status: 'OK',
   *   threshold: 0,
   *   untrusted: false,
   *   version: 7,
   *   votes: 10080,
   *   voting: 7,
   *   window: 10080
   * }
   */
  hard_fork_info() {
    return this._run('hard_fork_info');
  }

  /**
   * Look up transaction information
   *
   * @function gettransactions
   * @param {array} txs_hashes - An array of tranasction hashes to look up
   *
   * @returns {object} - Example: {
   *   status: 'OK',
   *   txs: [
   *     {
   *       as_hex: '...',
   *       as_json: '...',
   *       block_height: 1071370,
   *       block_timestamp: 1522449191,
   *       double_spend_seen: false,
   *       in_pool: false,
   *       output_indices: [Array],
   *       tx_hash: '...'
   *     }, {...}
   *   ],
   *   txs_as_hex: [...],
   *   txs_as_json: [...],
   *   untrusted: false
   * }
   * 
   */
  gettransactions(txs_hashes) {
    let params = { txs_hashes: txs_hashes, decode_as_json: true };
    return this._run(null, params, 'gettransactions');
  }

  /**
   * Look up output information
   *
   * @function getouts
   * @param {array} outputs - An array of output indexes to look up.  Example: [{ index: 586696 }, { index: 1394504 }]
   *
   * @returns {object} - Example: {
   *   outs: 
   *     [ { height: 1286190,
   *         key: '0f01d1b040a2489b168c252ec19e6c7eb9a4d4e10a37245b82bf8df63454d7b1',
   *         mask: 'a537f783ca0cbe460d3fee6da9b33d3dabd7df1e212ec46e5bfce97124b489a4',
   *         txid: 'd45df623c03d86809229a87755fc323de4dd3db59365323ba6c972d02f7a7a04',
   *         unlocked: true } ],
   *    status: 'OK',
   *    untrusted: false }
   * }
   * 
   */
  get_outs(outputs) {
    let params = { outputs: outputs };
    return this._run(null, params, 'get_outs');
  }
}

module.exports = daemonRPC;
