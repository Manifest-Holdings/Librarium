/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'
import { shortenAddress } from '../utils/formatters'

const WEB3_MODAL_CONFIG = {
  network: process.env.NEXT_PUBLIC_NETWORK,
  cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        pollingInterval: 20000000,
        rpc: {
          1: process.env.NEXT_PUBLIC_ALCHEMY_ENDPOINT,
        },
      },
    },
  },
}

const isServer = typeof window === 'undefined'

const defaultWalletContext = {
  isConnected: false,
  signer: null,
  provider: null,
  connectWallet: () => {},
  disconnectWallet: () => {},
  account: '',
  displayName: '',
  balance: 0,
  networkId: '',
}

const WalletContext = createContext<{
  isConnected: boolean
  signer: ethers.providers.JsonRpcSigner | null
  provider: ethers.providers.Provider | null
  connectWallet: () => void
  disconnectWallet: () => void
  account: string
  displayName: string
  balance: number
  networkId: string
}>(defaultWalletContext)

interface WalletProviderProps {
  children: React.ReactNode
}

export const WalletProvider = (props: WalletProviderProps) => {
  const wallet = useWallet()
  return (
    <WalletContext.Provider value={wallet}>
      {props.children}
    </WalletContext.Provider>
  )
}

function useWallet() {
  const [modal, setModal] = useState<Web3Modal>()
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>()
  const [provider, setProvider] = useState<ethers.providers.Provider>()
  const [isConnected, setIsConnected] = useState(false)
  const [account, setAccount] = useState<string>('')
  const [networkId, setNetworkId] = useState<string>('')
  const [displayName, setDisplayName] = useState('')
  const [balance, setBalance] = useState(0)

  async function connectWallet() {
    console.log('trying to connect')
    const web3Modal = new Web3Modal(WEB3_MODAL_CONFIG)
    setModal(web3Modal)
    login(web3Modal)
  }

  async function updateAccount(provider, address) {
    let ensName, balance
    setAccount(address)

    try {
      ensName = await provider.lookupAddress(address)
      balance = await provider.getBalance(address)
      const network = await provider.getNetwork()
      setNetworkId(network.chainId)
      setDisplayName(ensName ?? shortenAddress(address))
      setBalance(
        parseFloat(parseFloat(ethers.utils.formatUnits(balance)).toFixed(4))
      )
    } catch (e) {
      setDisplayName(shortenAddress(address))
    }
  }

  async function isMetaMaskAndUnlocked(modal) {
    if (modal?.cachedProvider !== 'injected' || !window?.ethereum?.isMetaMask) {
      return false
    }
    // Experimental function
    return window?.ethereum?._metamask?.isUnlocked()
  }

  async function login(newModal: Web3Modal) {
    try {
      const rawProvider = await newModal.connect()
      const provider = new ethers.providers.Web3Provider(rawProvider)
      const signer = provider.getSigner()
      setSigner(signer)
      setProvider(provider)
      const address = await signer.getAddress()
      if (address) {
        await updateAccount(provider, address)
      }
      setIsConnected(true)

      if (rawProvider) {
        rawProvider.on('accountsChanged', async (accounts) => {
          if (accounts?.length > 0) {
            await updateAccount(provider, accounts[0])
          }
        })

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        rawProvider.on('chainChanged', async (chainId) => {
          // TODO: handle chain changes
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  function disconnectWallet() {
    modal.clearCachedProvider()
    setModal(null)
    setSigner(null)
    setProvider(null)
    setAccount('')
    setIsConnected(false)
    setDisplayName('')
    setNetworkId('')
  }

  useEffect(() => {
    async function tryAutoLogin() {
      const web3Modal = new Web3Modal(WEB3_MODAL_CONFIG)
      if (web3Modal.cachedProvider) {
        const isMetaMaskUnlocked = await isMetaMaskAndUnlocked(web3Modal)
        if (isMetaMaskUnlocked) {
          setModal(web3Modal)
          login(web3Modal)
        }
      }
    }
    if (!isServer) tryAutoLogin()
  }, [isServer])

  return {
    connectWallet,
    signer,
    provider,
    disconnectWallet,
    isConnected,
    account,
    displayName,
    balance,
    networkId,
  }
}

export function useWalletContext() {
  return useContext(WalletContext)
}
