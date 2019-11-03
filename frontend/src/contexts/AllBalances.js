import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react'
import { ethers } from 'ethers'
import { getTokenReserves, getMarketDetails, BigNumber } from '@uniswap/sdk'
import { useWeb3Context } from 'web3-react'

import { safeAccess, isAddress, getEtherBalance, getTokenBalance } from '../utils'
import { useAllTokenDetails } from './Tokens'
import { getBalances } from './Blockchain'

const ZERO = ethers.utils.bigNumberify(0)
const ONE = new BigNumber(1)

const UPDATE = 'UPDATE'

const AllBalancesContext = createContext()

function useAllBalancesContext() {
  return useContext(AllBalancesContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { allBalanceData, networkId, address } = payload
      return {
        ...state,
        [networkId]: {
          ...(safeAccess(state, [networkId]) || {}),
          [address]: {
            ...(safeAccess(state, [networkId, address]) || {}),
            allBalanceData
          }
        }
      }
    }
    default: {
      throw Error(`Unexpected action type in AllBalancesContext reducer: '${type}'.`)
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {})

  const update = useCallback((allBalanceData, networkId, address) => {
    dispatch({ type: UPDATE, payload: { allBalanceData, networkId, address } })
  }, [])

  return (
    <AllBalancesContext.Provider value={useMemo(() => [state, { update }], [state, update])}>
      {children}
    </AllBalancesContext.Provider>
  )
}

export function useFetchAllBalances() {
  const { account, networkId, library } = useWeb3Context()

  const allTokens = useAllTokenDetails()

  const [state, { update }] = useAllBalancesContext()

  const { allBalanceData } = safeAccess(state, [networkId, account]) || {}

  const getData = async () => {

    if (!!library) {
      const newBalances = {}
      await Promise.all(
        Object.keys(allTokens).map(async k => {
          let balance = await getTokenBalanceFromTendermint(k, account, library);
          let ethRate = null
          return (newBalances[k] = { balance, ethRate })
        })
      )
      update(newBalances, networkId, account)
    }
  }

  const getTokenBalanceFromTendermint = async (k, account, library) => {
    const balances = await getBalances()
    return new BigNumber(balances.fra[k]);
  }

  useMemo(getData, [account])

  return allBalanceData
}
