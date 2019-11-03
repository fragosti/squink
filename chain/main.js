let lotion = require('lotion');
let handler = require('./handler');


let app = lotion({
	initialState: {
		fra: {
			DAI: 10000 * Math.pow(10, 18),
			USDC: 10000 * Math.pow(10, 18),
			TERRA: 10000 * Math.pow(10, 18),
		},
		pool: {
			DAI: 100030 * Math.pow(10, 18),
			USDC: 1000 * Math.pow(10, 18),
			TERRA: 100010 * Math.pow(10, 18),
		}
	},
	p2pPort: 26658,                // port to use for tendermint peer connections
	rpcPort: 26657                 // port to use for tendermint rpc
	// genesisPath: '/Users/danielpyrathon/.lotion/networks/0b1053cc6f44648c67e072bbc1e81fac/config/genesis.json',
});

app.use(handler.handler);
app.start().then(appInfo => console.log(appInfo))
