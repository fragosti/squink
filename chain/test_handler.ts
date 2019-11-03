import { handler, State, TransactionHandler, Currencies } from "./handler";

const initialState: State = {
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
};

const asd: Currencies[] = ["DAI", "USDC", "TERRA"]

for (let index = 0; index < 100; index++) {

    const fromCurrency = asd[index % 3]
    const toCurrency = asd[(index + 1) % 3]

    const tx : TransactionHandler = {
        amount: 100,
        command: "buy",
        from: fromCurrency,
        to: toCurrency,
    }
    
    const oldUsdc = initialState.fra[toCurrency];
    // console.log(`Before: ${JSON.stringify(initialState)}`);
    handler(initialState, tx)
    const deltaUsdc = initialState.fra[toCurrency] - oldUsdc;
    console.log(`${toCurrency} purchased: ${deltaUsdc}. Price: ${deltaUsdc / tx.amount }`);
}
console.log(`After: ${JSON.stringify(initialState)}`);