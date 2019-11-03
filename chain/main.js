let lotion = require('lotion');
let handler = require('./handler');


let app = lotion({
	initialState: {
		fra: {
			DAI: 1000000000000000000000,
			USDC: 100000000000000000000,
			TERRA: 100000000000000000000,
		},
		pool: {
			DAI: 100030,
			USDC: 1000,
			TERRA: 100010,
		}
	},
	// genesisPath: '/Users/danielpyrathon/.lotion/networks/0b1053cc6f44648c67e072bbc1e81fac/config/genesis.json',
});

app.use(handler.handler);
app.start().then(appInfo => console.log(appInfo))