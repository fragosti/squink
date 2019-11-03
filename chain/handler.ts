export type Currencies = "DAI" | "USDC" | "TERRA"

export interface TransactionHandler {
    command: "buy",
    from: Currencies,
    to: Currencies,
    amount: number
}

interface Balances {
    [key: string]: number
}

export interface State {
    fra: Balances,
    pool: Balances,
}

const RO = 99./100

function getInvariant(state: State): number {
    const summedPower = Math.pow(state.pool["DAI"], RO) + Math.pow(state.pool["USDC"], RO) + Math.pow(state.pool["TERRA"], RO)
    return Math.pow(summedPower, 1/RO);
}

function getOtherToken(balances: Balances, tx: TransactionHandler): string {
    const fromAndTo = new Set()
    fromAndTo.add(tx.from);
    fromAndTo.add(tx.to);
    for (const token of Object.keys(balances)) {
        if (!fromAndTo.has(token)) {
            return token;
        }
    }
    throw new Error("FOO!")
}

export function handler(state: State, tx: TransactionHandler): void {
    switch(tx.command) {
        case 'buy':
            if (tx.from === tx.to) {
                return;
            }
            if (state.fra[tx.from] < tx.amount) {
                return;
            }
            const invariant = getInvariant(state);
            const newSentToken = state.pool[tx.from] + tx.amount;
            const other = getOtherToken(state.pool, tx);

            const newPoolSize = Math.pow(invariant, RO) - Math.pow(state.pool[other], RO) - Math.pow(newSentToken, RO);
            const newPoolSizeNormalized = Math.pow(newPoolSize, 1/RO);

            const toUser = state.pool[tx.to] - newPoolSizeNormalized;

            state.pool[tx.from] = newSentToken;
            state.pool[tx.to] = newPoolSizeNormalized;

            state.fra[tx.from] -= tx.amount
            state.fra[tx.to] += toUser;
    }
}