"use strict"

const Serializer = require("./serializer.js");
const { SignedTransaction } = require("../generated/SignedTransaction_pb.js");
const rippleCodec = require("ripple-binary-codec");

/**
 * Abstracts the details of signing.
 */
class Signer {
  /**
   * Encode the given object to hex and sign it.
   *
   * @param {Terram.Transaction} transaction The transaction to sign.
   * @param {Terram.Wallet} wallet The wallet to sign the transaction with.
   * @returns {Terram.SignedTransaction} A signed transaction.
   */
  static signTransaction(transaction, wallet) {
    if (transaction === undefined || wallet === undefined) {
      return undefined;
    }

    const transactionJSON = Serializer.transactionToJSON(transaction);
    const transactionHex = rippleCodec.encodeForSigning(transactionJSON);
    const signatureHex = wallet.sign(transactionHex);

    const signedTransaction = new SignedTransaction();
    signedTransaction.setTransaction(transaction);
    signedTransaction.setTransactionSignatureHex(signatureHex);
    signedTransaction.setPublicKeyHex(wallet.getPublicKey());

    return signedTransaction;
  }
}

module.exports = Signer;
