let connect = require('lotion-connect')

const genesis = {
  "genesis_time": "2019-11-03T15:56:15.568965Z",
  "chain_id": "test-chain-lRkfLd",
  "consensus_params": {
    "block": {
      "max_bytes": "22020096",
      "max_gas": "-1",
      "time_iota_ms": "1000"
    },
    "evidence": {
      "max_age": "100000"
    },
    "validator": {
      "pub_key_types": [
        "ed25519"
      ]
    }
  },
  "validators": [
    {
      "address": "17622109EB8147719637448CB9ED7766125DFF9D",
      "pub_key": {
        "type": "tendermint/PubKeyEd25519",
        "value": "K8jHbTSbVaGeLJpJ9boe5OBZDriUhaCjjyb2H7Jy2sE="
      },
      "power": "10",
      "name": ""
    }
  ],
  "app_hash": ""
  }

let connection = null;

const getConnection = async () => {
    if (connection === null) {
        connection = await connect(null, {
            genesis: genesis,
            nodes: ['ws://localhost:26657']
        });
    }
    return connection
}

export const getBalances = async () => {
    let { state } = await getConnection();
    const res = await state
    window.cachedState = res;
    return res;
}

export const trade = async () => {
    debugger;
    let { state } = await connect(null, {
        genesis: genesis,
        nodes: [ 'ws://localhost:26657' ]
      });
    const res = await state
    return res;
}