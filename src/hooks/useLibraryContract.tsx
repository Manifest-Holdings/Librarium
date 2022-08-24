import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import libraryABI from '../abi/library-contract-abi.json'
import { useWalletContext } from './useWalletContext'

if (!process.env.NEXT_PUBLIC_LIBRARY_CONTRACT_ADDRESS)
  throw new Error(
    'Please set the NEXT_PUBLIC_LIBRARY_CONTRACT_ADDRESS environment variable'
  )
export const LIBRARY_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_LIBRARY_CONTRACT_ADDRESS
export function useLibraryContract() {
  const wallet = useWalletContext()
  const [libraryContract, setLibraryContract] = useState<ethers.Contract>()

  useEffect(() => {
    if (!wallet?.signer) {
      return
    }
    const contract = new ethers.Contract(
      LIBRARY_CONTRACT_ADDRESS,
      libraryABI,
      wallet?.signer
    )
    setLibraryContract(contract)
  }, [wallet?.signer])

  async function hasValidPublishAccess() {
    try {
      const result = await libraryContract.hasValidPublishAccess()
      return result
    } catch (err) {
      console.log(err)
      return false
    }
  }

  async function record(
    title: string,
    author: string,
    authorWallet: string,
    content: string,
    tags: Array<string>
  ) {
    try {
      const result = await libraryContract.record(
        title,
        author,
        authorWallet,
        content,
        tags
      )
      return result
    } catch (err) {
      console.log(err)
      return false
    }
  }

  async function revoke(txnHash: string) {
    try {
      const result = await libraryContract.revoke(txnHash)
      return result
    } catch (err) {
      console.log(err)
      return false
    }
  }
  return {
    libraryContract,
    record,
    revoke,
    hasValidPublishAccess,
  }
}
