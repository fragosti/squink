import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import { ethers } from 'ethers'

import {
  isAddress,
  getTokenName,
  getTokenSymbol,
  getTokenDecimals,
  getTokenExchangeAddressFromFactory,
  safeAccess
} from '../utils'

const NAME = 'name'
const SYMBOL = 'symbol'
const DECIMALS = 'decimals'
const EXCHANGE_ADDRESS = 'exchangeAddress'

const UPDATE = 'UPDATE'

const ETH = {
}

const INITIAL_TOKENS_CONTEXT = {
  1: {
    'DAI': {
      [NAME]: 'Dai Stablecoin v1.0',
      [SYMBOL]: 'DAI',
      [DECIMALS]: 18,
      [EXCHANGE_ADDRESS]: '0x09cabEC1eAd1c0Ba254B09efb3EE13841712bE14'
    },
    'USDC': {
      [NAME]: 'USDC',
      [SYMBOL]: 'USDC',
      [DECIMALS]: 18,
      [EXCHANGE_ADDRESS]: '0x97deC872013f6B5fB443861090ad931542878126'
    },
    'TERRA': {
      [NAME]: 'KRT',
      [SYMBOL]: 'KRT',
      [DECIMALS]: 18,
      [EXCHANGE_ADDRESS]: '0x97deC872013f6B5fB443861090ad931542878126'
    },
  },
  4: {
    '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa': {
      [NAME]: 'Dai',
      [SYMBOL]: 'DAI',
      [DECIMALS]: 18,
      [EXCHANGE_ADDRESS]: '0xaF51BaAA766b65E8B3Ee0C2c33186325ED01eBD5'
    }
  }
}

const TokensContext = createContext()

function useTokensContext() {
  return useContext(TokensContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { networkId, tokenAddress, name, symbol, decimals, exchangeAddress } = payload
      return {
        ...state,
        [networkId]: {
          ...(safeAccess(state, [networkId]) || {}),
          [tokenAddress]: {
            [NAME]: name,
            [SYMBOL]: symbol,
            [DECIMALS]: decimals,
            [EXCHANGE_ADDRESS]: exchangeAddress
          }
        }
      }
    }
    default: {
      throw Error(`Unexpected action type in TokensContext reducer: '${type}'.`)
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_TOKENS_CONTEXT)

  const update = useCallback((networkId, tokenAddress, name, symbol, decimals, exchangeAddress) => {
    dispatch({ type: UPDATE, payload: { networkId, tokenAddress, name, symbol, decimals, exchangeAddress } })
  }, [])

  return (
    <TokensContext.Provider value={useMemo(() => [state, { update }], [state, update])}>
      {children}
    </TokensContext.Provider>
  )
}

export function useTokenDetails(tokenAddress) {
  const { networkId, library } = useWeb3Context()

  const [state, { update }] = useTokensContext()
  const allTokensInNetwork = { ...ETH, ...(safeAccess(state, [networkId]) || {}) }
  const { [NAME]: name, [SYMBOL]: symbol, [DECIMALS]: decimals, [EXCHANGE_ADDRESS]: exchangeAddress } =
    safeAccess(allTokensInNetwork, [tokenAddress]) || {}

  useEffect(() => {
    if (
      isAddress(tokenAddress) &&
      (name === undefined || symbol === undefined || decimals === undefined || exchangeAddress === undefined) &&
      (networkId || networkId === 0) &&
      library
    ) {
      let stale = false

      const namePromise = getTokenName(tokenAddress, library).catch(() => null)
      const symbolPromise = getTokenSymbol(tokenAddress, library).catch(() => null)
      const decimalsPromise = getTokenDecimals(tokenAddress, library).catch(() => null)
      const exchangeAddressPromise = getTokenExchangeAddressFromFactory(tokenAddress, networkId, library).catch(
        () => null
      )

      Promise.all([namePromise, symbolPromise, decimalsPromise, exchangeAddressPromise]).then(
        ([resolvedName, resolvedSymbol, resolvedDecimals, resolvedExchangeAddress]) => {
          if (!stale) {
            update(networkId, tokenAddress, resolvedName, resolvedSymbol, resolvedDecimals, resolvedExchangeAddress)
          }
        }
      )
      return () => {
        stale = true
      }
    }
  }, [tokenAddress, name, symbol, decimals, exchangeAddress, networkId, library, update])

  return { name, symbol, decimals, exchangeAddress }
}

export function useAllTokenDetails(requireExchange = true) {
  const { networkId } = useWeb3Context()

  const [state] = useTokensContext()
  const tokenDetails = { ...ETH, ...(safeAccess(state, [networkId]) || {}) }

  return requireExchange
    ? Object.keys(tokenDetails)
        .filter(
          tokenAddress =>
            tokenAddress === 'ETH' ||
            (safeAccess(tokenDetails, [tokenAddress, EXCHANGE_ADDRESS]) &&
              safeAccess(tokenDetails, [tokenAddress, EXCHANGE_ADDRESS]) !== ethers.constants.AddressZero)
        )
        .reduce((accumulator, tokenAddress) => {
          accumulator[tokenAddress] = tokenDetails[tokenAddress]
          return accumulator
        }, {})
    : tokenDetails
}
