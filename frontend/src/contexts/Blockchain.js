let connect = require('lotion-connect')

const genesis = {
    "genesis_time": "2019-11-03T15:19:09.522358Z",
    "chain_id": "test-chain-2KwKKo",
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
        "address": "A9C7F84A8A95D3FACD73D586E6EE1EF1D95D5649",
        "pub_key": {
          "type": "tendermint/PubKeyEd25519",
          "value": "6oJKIwVVPbLV6Sl7BG2zFd+sJh7AKDlvtGUxwWbszAU="
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