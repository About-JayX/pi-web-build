import React, { useState, useEffect } from 'react'
import {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js'
import { Program, AnchorProvider, web3, BN, utils } from '@project-serum/anchor'
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token'
import {
  MPL_TOKEN_METADATA_PROGRAM_ID,
  findMetadataPda,
} from '@metaplex-foundation/js'

// Import your IDL JSON here
import idl from './idl.json'

// Constants
const FAIR_CURVE_SEED = Buffer.from('fair_curve_seed')
const programId = new PublicKey('YOUR_PROGRAM_ID_HERE')

// Types
interface TokenFormData {
  name: string
  symbol: string
  uri: string
  supply: string
}

const TokenCreator: React.FC = () => {
  const [wallet, setWallet] = useState<any>(null)
  const [connection, setConnection] = useState<Connection | null>(null)
  const [formData, setFormData] = useState<TokenFormData>({
    name: '',
    symbol: '',
    uri: '',
    supply: '1000000',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Initialize connection and wallet when component mounts
  useEffect(() => {
    const initializeWallet = async () => {
      // Check if Phantom wallet is available
      const solanaWindow = window as any

      if (solanaWindow?.solana?.isPhantom) {
        try {
          // Connect to wallet
          const response = await solanaWindow.solana.connect()

          // Create connection to devnet (change to mainnet-beta for production)
          const conn = new Connection(
            'https://api.devnet.solana.com',
            'confirmed'
          )

          setWallet({
            publicKey: new PublicKey(response.publicKey.toString()),
            signTransaction: async (transaction: Transaction) => {
              return await solanaWindow.solana.signTransaction(transaction)
            },
            signAllTransactions: async (transactions: Transaction[]) => {
              return await solanaWindow.solana.signAllTransactions(transactions)
            },
          })

          setConnection(conn)
        } catch (error) {
          console.error('Error connecting to wallet:', error)
          setMessage(
            'Failed to connect to wallet. Please install Phantom and try again.'
          )
        }
      } else {
        setMessage(
          'Phantom wallet not found. Please install it to use this app.'
        )
      }
    }

    initializeWallet()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const createToken = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!wallet || !connection) {
      setMessage('Please connect your wallet first')
      return
    }

    setLoading(true)
    setMessage('Creating token, please wait...')

    try {
      // Create AnchorProvider
      const provider = new AnchorProvider(connection, wallet, {
        commitment: 'confirmed',
      })

      // Initialize program
      const program = new Program(idl as any, programId, provider)

      // Create a new keypair for the mint account
      const mintKeypair = Keypair.generate()

      // Calculate total supply with decimals
      const supply = new BN(Number(formData.supply) * Math.pow(10, 6))

      // Derive PDA for FairCurve
      const [fairCurvePda, fairCurveBump] = PublicKey.findProgramAddressSync(
        [FAIR_CURVE_SEED, mintKeypair.publicKey.toBuffer()],
        programId
      )

      // Get metadata PDA
      const metadataPda = findMetadataPda(mintKeypair.publicKey)

      // Calculate associated token account for the FairCurve PDA
      const associatedFairCurveAta = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        fairCurvePda,
        true
      )

      // Submit transaction to create token
      const tx = await program.methods
        .createToken(formData.name, formData.symbol, formData.uri, supply)
        .accounts({
          signer: wallet.publicKey,
          authority: wallet.publicKey,
          mint: mintKeypair.publicKey,
          fairCurve: fairCurvePda,
          associatedFairCurve: associatedFairCurveAta,
          metadata: metadataPda,
          mplTokenMetadata: MPL_TOKEN_METADATA_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .signers([mintKeypair])
        .rpc()

      setMessage(`Token created successfully! Transaction signature: ${tx}`)
      console.log('Transaction signature:', tx)

      // You can add code here to wait for confirmation if needed
      await connection.confirmTransaction(tx, 'confirmed')

      // Reset form after successful creation
      setFormData({
        name: '',
        symbol: '',
        uri: '',
        supply: '1000000',
      })
    } catch (error) {
      console.error('Error creating token:', error)
      setMessage(
        `Failed to create token: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create New Token</h1>

      {wallet ? (
        <p className="mb-4 text-green-600">
          Connected: {wallet.publicKey.toString().slice(0, 8)}...
          {wallet.publicKey.toString().slice(-8)}
        </p>
      ) : (
        <p className="mb-4 text-red-600">Wallet not connected</p>
      )}

      <form onSubmit={createToken}>
        <div className="mb-3">
          <label className="block text-gray-700 mb-1">Token Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="My Token"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 mb-1">Symbol</label>
          <input
            type="text"
            name="symbol"
            value={formData.symbol}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="TKN"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 mb-1">Metadata URI</label>
          <input
            type="text"
            name="uri"
            value={formData.uri}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="https://example.com/metadata.json"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Initial Supply</label>
          <input
            type="number"
            name="supply"
            value={formData.supply}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="1000000"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            The actual supply will have 6 decimal places
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !wallet}
          className={`w-full p-2 rounded ${
            loading || !wallet ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {loading ? 'Creating...' : 'Create Token'}
        </button>
      </form>

      {message && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p>{message}</p>
        </div>
      )}
    </div>
  )
}

export default TokenCreator
