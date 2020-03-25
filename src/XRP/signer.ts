import * as rippleCodec from 'ripple-binary-codec'
import Serializer, { TransactionJSON } from './serializer'
import { SignedTransaction } from './generated/legacy/signed_transaction_pb'
import { Transaction as LegacyTransaction } from './generated/legacy/transaction_pb'
import { Transaction } from './generated/org/xrpl/rpc/v1/transaction_pb'
import Wallet from './wallet'
import Utils from '../Common/utils'

/**
 * Abstracts the details of signing.
 */
class Signer {
  /**
   * Encode the given raw JSON transaction to hex and sign it.
   *
   * @param {TransactionJSON} transactionJSON The raw transaction JSON object.
   * @param {Wallet} wallet The wallet to sign the transaction with.
   * @returns {Uint8Array} A set of bytes representing the inputs and a signature.
   */
  public static signTransactionFromJSON(
    transactionJSON: TransactionJSON,
    wallet: Wallet,
  ): Uint8Array {
    const transactionHex = rippleCodec.encodeForSigning(transactionJSON)
    const signatureHex = wallet.sign(transactionHex)

    if (!signatureHex) {
      throw new Error('Unable to produce a signature.')
    }

    const signedTransactionJSON = {
      ...transactionJSON,
      TxnSignature: signatureHex,
    }
    const signedTransactionHex = rippleCodec.encode(signedTransactionJSON)
    return Utils.toBytes(signedTransactionHex)
  }

  /**
   * Encode the given object to hex and sign it.
   *
   * @param {Transaction} transaction The transaction to sign.
   * @param {Wallet} wallet The wallet to sign the transaction with.
   * @returns {Uint8Array} A set of bytes representing the inputs and a signature.
   */
  public static signTransaction(
    transaction: Transaction,
    wallet: Wallet,
  ): Uint8Array | undefined {
    if (transaction === undefined || wallet === undefined) {
      return undefined
    }

    const transactionJSON = Serializer.transactionToJSON(transaction)
    if (transactionJSON === undefined) {
      return undefined
    }
    return Signer.signTransactionFromJSON(transactionJSON, wallet)
  }

  /**
   * Encode the given object to hex and sign it.
   *
   * @param {Transaction} transaction The transaction to sign.
   * @param {Wallet} wallet The wallet to sign the transaction with.
   * @returns {SignedTransaction} A signed transaction.
   */
  public static signLegacyTransaction(
    transaction: LegacyTransaction,
    wallet: Wallet,
  ): SignedTransaction | undefined {
    if (transaction === undefined || wallet === undefined) {
      return undefined
    }

    const transactionJSON = Serializer.legacyTransactionToJSON(transaction)
    if (transactionJSON === undefined) {
      return undefined
    }
    const transactionHex = rippleCodec.encodeForSigning(transactionJSON)

    const signatureHex = wallet.sign(transactionHex)
    if (signatureHex === undefined) {
      return undefined
    }

    const signedTransaction = new SignedTransaction()
    signedTransaction.setTransaction(transaction)
    signedTransaction.setTransactionSignatureHex(signatureHex)

    return signedTransaction
  }
}

export default Signer
