let lotion = require('lotion');
let handler = require('./handler');


let app = lotion({
	initialState: {
		fra: {
			DAI: 100000,
			USDC: 3000,
			TERRA: 10000000,
		},
		pool: {
			DAI: 100030,
			USDC: 1000,
			TERRA: 100010,
		}
	}
});

app.use(handler.handler);
app.start().then(appInfo => console.log(appInfo))