let connect = require('lotion-connect')

const genesis = {
    "genesis_time": "2019-11-03T07:27:56.902671Z",
    "chain_id": "test-chain-O1niRD",
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
        "address": "5990D63295DEB05BB89614E6D36A2B2327EE1AAF",
        "pub_key": {
          "type": "tendermint/PubKeyEd25519",
          "value": "6xQMP2zjrbQevZdB+rxapeQ7EWtlkmJKTa/6789rakA="
        },
        "power": "10",
        "name": ""
      }
    ],
    "app_hash": ""
  }

export const getBalances = async () => {
    let { state, send } = await connect(null, {
        genesis: genesis,
        nodes: [ 'ws://localhost:26657' ]
      });
    const res = await state
    console.log(res);
}