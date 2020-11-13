/* eslint-disable max-lines --
 * Allow many lines of tests.
 */
import { assert } from 'chai'
import * as rippleCodec from 'ripple-binary-codec'

import 'mocha'
import Utils from '../../src/Common/utils'
import Serializer, { TransactionJSON } from '../../src/XRP/serializer'
import Signer from '../../src/XRP/signer'
import XrpUtils from '../../src/XRP/xrp-utils'

import {
  fakeSignature,
  testTransactionAccountSetAllFields,
  testTransactionAccountSetOneField,
  testTransactionAccountSetEmpty,
  testTransactionAccountSetSpecialCases,
  testTransactionOfferCancelAllFields,
  testTransactionOfferCreateAllFields,
  testTransactionPaymentMandatoryFields,
  testTransactionPaymentMandatoryFieldsIssuedCurrency,
  testTransactionPaymentAllFields,
  testTransactionTrustSetMandatoryFields,
  testTransactionTrustSetAllFields,
  testTransactionTrustSetSpecialCases,
  testInvalidTransactionPaymentNoAmount,
  testInvalidTransactionPaymentNoDestination,
  testInvalidTransactionPaymentBadDestination,
  testInvalidTransactionPaymentNoAccount,
  testInvalidTransactionPaymentNoFee,
  testInvalidTransactionPaymentNoPayment,
  testInvalidTransactionTrustSetNoLimitAmount,
} from './fakes/fake-protobufs'
import FakeWallet from './fakes/fake-wallet'

describe('Signer', function (): void {
  // Payment Transactions

  it('Sign Payment transaction with mandatory fields', function (): void {
    // GIVEN a Payment transaction with mandatory fields, a wallet and expected signing artifacts.
    const wallet = new FakeWallet(fakeSignature)
    // Encode transaction with the expected signature.
    const expectedSignedTransactionJSON = Serializer.transactionToJSON(
      testTransactionPaymentMandatoryFields,
      fakeSignature,
    )
    const expectedSignedTransactionHex = rippleCodec.encode(
      expectedSignedTransactionJSON,
    )
    const expectedSignedTransaction = Utils.toBytes(
      expectedSignedTransactionHex,
    )

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(
      testTransactionPaymentMandatoryFields,
      wallet,
    )

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction)
    assert.deepEqual(signedTransaction, expectedSignedTransaction)
  })

  it('Sign Payment transaction with mandatory fields + issued currency', function (): void {
    // GIVEN a Payment transaction with mandatory fields + issued currency,
    // a wallet and expected signing artifacts.
    const wallet = new FakeWallet(fakeSignature)
    // Encode transaction with the expected signature.
    const expectedSignedTransactionJSON = Serializer.transactionToJSON(
      testTransactionPaymentMandatoryFieldsIssuedCurrency,
      fakeSignature,
    )
    const expectedSignedTransactionHex = rippleCodec.encode(
      expectedSignedTransactionJSON,
    )
    const expectedSignedTransaction = Utils.toBytes(
      expectedSignedTransactionHex,
    )

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(
      testTransactionPaymentMandatoryFieldsIssuedCurrency,
      wallet,
    )

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction)
    assert.deepEqual(signedTransaction, expectedSignedTransaction)
  })

  it('Sign Payment transaction with all fields', function (): void {
    // GIVEN a Payment transaction with all fields, a wallet and expected signing artifacts.
    const wallet = new FakeWallet(fakeSignature)

    // Encode transaction with the expected signature.
    const expectedSignedTransactionJSON = Serializer.transactionToJSON(
      testTransactionPaymentAllFields,
      fakeSignature,
    )

    const expectedSignedTransactionHex = rippleCodec.encode(
      expectedSignedTransactionJSON,
    )
    const expectedSignedTransaction = Utils.toBytes(
      expectedSignedTransactionHex,
    )

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(
      testTransactionPaymentAllFields,
      wallet,
    )

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction)
    assert.deepEqual(signedTransaction, expectedSignedTransaction)
  })

  it('Sign Payment transaction with no amount', function (): void {
    // GIVEN a Payment transaction without an amount field and a wallet.
    const wallet = new FakeWallet(fakeSignature)

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(
      testInvalidTransactionPaymentNoAmount,
      wallet,
    )

    // THEN the signing artifacts are undefined.
    assert.isUndefined(signedTransaction)
  })

  it('Sign Payment transaction with no destination', function (): void {
    // GIVEN a Payment transaction without a destination field and a wallet.
    const wallet = new FakeWallet(fakeSignature)

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(
      testInvalidTransactionPaymentNoDestination,
      wallet,
    )

    // THEN the signing artifacts are undefined.
    assert.isUndefined(signedTransaction)
  })

  it('Sign Payment transaction with bad destination', function (): void {
    // GIVEN a Payment transaction with a bad destination field and a wallet.
    const wallet = new FakeWallet(fakeSignature)

    // WHEN the transaction is signed with the wallet THEN an error is thrown.
    assert.throws(() => {
      Signer.signTransaction(
        testInvalidTransactionPaymentBadDestination,
        wallet,
      )
    }, Error)
  })

  it('Sign Payment transaction with no account', function (): void {
    // GIVEN a Payment transaction without an account field and a wallet.
    const wallet = new FakeWallet(fakeSignature)

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(
      testInvalidTransactionPaymentNoAccount,
      wallet,
    )

    // THEN the signing artifacts are undefined.
    assert.isUndefined(signedTransaction)
  })

  it('Sign Payment transaction with no fee', function (): void {
    // GIVEN a Payment transaction without a transaction fee field and a wallet.
    const wallet = new FakeWallet(fakeSignature)

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(
      testInvalidTransactionPaymentNoFee,
      wallet,
    )

    // THEN the signing artifacts are undefined.
    assert.isUndefined(signedTransaction)
  })

  it('Sign Payment transaction with no payment', function (): void {
    // GIVEN a Payment transaction without a payment field and a wallet.
    const wallet = new FakeWallet(fakeSignature)

    // WHEN the transaction is signed with the wallet THEN an error is thrown.
    assert.throws(() => {
      Signer.signTransaction(testInvalidTransactionPaymentNoPayment, wallet)
    }, Error)
  })

  it('Sign Payment transaction from JSON', function (): void {
    // GIVEN a transaction, a wallet and expected signing artifacts.
    const wallet = new FakeWallet(fakeSignature)
    const destinationAddress = XrpUtils.decodeXAddress(
      'XVPcpSm47b1CZkf5AkKM9a84dQHe3m4sBhsrA4XtnBECTAc',
    )
    const sourceAddress = XrpUtils.decodeXAddress(
      'X7vjQVCddnQ7GCESYnYR3EdpzbcoAMbPw7s2xv8YQs94tv4',
    )

    const transactionJSON: TransactionJSON = {
      Account: sourceAddress!.address,
      Fee: '10',
      Sequence: 1,
      LastLedgerSequence: 0,
      SigningPubKey: 'BEEFDEAD',
      Amount: '1000',
      Destination: destinationAddress!.address,
      TransactionType: 'Payment',
    }

    // Encode transaction with the expected signature.
    const expectedSignedTransactionJSON = {
      ...transactionJSON,
      TxnSignature: fakeSignature,
    }

    const expectedSignedTransactionHex = rippleCodec.encode(
      expectedSignedTransactionJSON,
    )
    const expectedSignedTransaction = Utils.toBytes(
      expectedSignedTransactionHex,
    )

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransactionFromJSON(
      transactionJSON,
      wallet,
    )

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction)
    assert.deepEqual(signedTransaction, expectedSignedTransaction)
  })
  // AccountSet Transactions

  it('Sign AccountSet transaction with all fields', function (): void {
    // GIVEN a AccountSet transaction with all fields set, a wallet and expected signing artifacts.
    const wallet = new FakeWallet(fakeSignature)

    // Encode transaction with the expected signature.
    const expectedSignedTransactionJSON = Serializer.transactionToJSON(
      testTransactionAccountSetAllFields,
      fakeSignature,
    )

    const expectedSignedTransactionHex = rippleCodec.encode(
      expectedSignedTransactionJSON,
    )
    const expectedSignedTransaction = Utils.toBytes(
      expectedSignedTransactionHex,
    )

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(
      testTransactionAccountSetAllFields,
      wallet,
    )

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction)
    assert.deepEqual(signedTransaction, expectedSignedTransaction)
  })

  it('Sign AccountSet transaction with one field', function (): void {
    // GIVEN a AccountSet transaction only one field set, a wallet and expected signing artifacts.
    const wallet = new FakeWallet(fakeSignature)

    // Encode transaction with the expected signature.
    const expectedSignedTransactionJSON = Serializer.transactionToJSON(
      testTransactionAccountSetOneField,
      fakeSignature,
    )

    const expectedSignedTransactionHex = rippleCodec.encode(
      expectedSignedTransactionJSON,
    )
    const expectedSignedTransaction = Utils.toBytes(
      expectedSignedTransactionHex,
    )

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(
      testTransactionAccountSetOneField,
      wallet,
    )

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction)
    assert.deepEqual(signedTransaction, expectedSignedTransaction)
  })

  it('Sign AccountSet transaction with no fields', function (): void {
    // GIVEN a AccountSet transaction with no fields set, a wallet and expected signing artifacts.
    const wallet = new FakeWallet(fakeSignature)

    // Encode transaction with the expected signature.
    const expectedSignedTransactionJSON = Serializer.transactionToJSON(
      testTransactionAccountSetEmpty,
      fakeSignature,
    )

    const expectedSignedTransactionHex = rippleCodec.encode(
      expectedSignedTransactionJSON,
    )
    const expectedSignedTransaction = Utils.toBytes(
      expectedSignedTransactionHex,
    )

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(
      testTransactionAccountSetEmpty,
      wallet,
    )

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction)
    assert.deepEqual(signedTransaction, expectedSignedTransaction)
  })

  it('Sign AccountSet transaction with special case fields', function (): void {
    // GIVEN a AccountSet transaction with fields set with special values, a wallet and expected signing artifacts.
    const wallet = new FakeWallet(fakeSignature)

    // Encode transaction with the expected signature.
    const expectedSignedTransactionJSON = Serializer.transactionToJSON(
      testTransactionAccountSetSpecialCases,
      fakeSignature,
    )

    const expectedSignedTransactionHex = rippleCodec.encode(
      expectedSignedTransactionJSON,
    )
    const expectedSignedTransaction = Utils.toBytes(
      expectedSignedTransactionHex,
    )

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(
      testTransactionAccountSetSpecialCases,
      wallet,
    )

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction)
    assert.deepEqual(signedTransaction, expectedSignedTransaction)
  })

  it('Sign TrustSet transaction with mandatory fields', function (): void {
    // GIVEN a TrustSet transaction with mandatory fields, a wallet and expected signing artifacts.
    const wallet = new FakeWallet(fakeSignature)

    // Encode transaction with the expected signature.
    const expectedSignedTransactionJSON = Serializer.transactionToJSON(
      testTransactionTrustSetMandatoryFields,
      fakeSignature,
    )

    const expectedSignedTransactionHex = rippleCodec.encode(
      expectedSignedTransactionJSON,
    )
    const expectedSignedTransaction = Utils.toBytes(
      expectedSignedTransactionHex,
    )

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(
      testTransactionTrustSetMandatoryFields,
      wallet,
    )

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction)
    assert.deepEqual(signedTransaction, expectedSignedTransaction)
  })

  it('Sign TrustSet transaction with all fields', function (): void {
    // GIVEN a TrustSet transaction with all fields, a wallet and expected signing artifacts.
    const wallet = new FakeWallet(fakeSignature)

    // Encode transaction with the expected signature.
    const expectedSignedTransactionJSON = Serializer.transactionToJSON(
      testTransactionTrustSetAllFields,
      fakeSignature,
    )

    const expectedSignedTransactionHex = rippleCodec.encode(
      expectedSignedTransactionJSON,
    )
    const expectedSignedTransaction = Utils.toBytes(
      expectedSignedTransactionHex,
    )

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(
      testTransactionTrustSetAllFields,
      wallet,
    )

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction)
    assert.deepEqual(signedTransaction, expectedSignedTransaction)
  })

  it('Sign TrustSet transaction with special-case fields', function (): void {
    // GIVEN a TrustSet transaction with fields' special cases, a wallet and expected signing artifacts.
    const wallet = new FakeWallet(fakeSignature)

    // Encode transaction with the expected signature.
    const expectedSignedTransactionJSON = Serializer.transactionToJSON(
      testTransactionTrustSetSpecialCases,
      fakeSignature,
    )

    const expectedSignedTransactionHex = rippleCodec.encode(
      expectedSignedTransactionJSON,
    )
    const expectedSignedTransaction = Utils.toBytes(
      expectedSignedTransactionHex,
    )

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(
      testTransactionTrustSetSpecialCases,
      wallet,
    )

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction)
    assert.deepEqual(signedTransaction, expectedSignedTransaction)
  })

  it('Sign TrustSet transaction with no limitAmount', function (): void {
    // GIVEN a TrustSet transaction without a limitAmount field and a wallet.
    const wallet = new FakeWallet(fakeSignature)

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(
      testInvalidTransactionTrustSetNoLimitAmount,
      wallet,
    )

    // THEN the signing artifacts are undefined.
    assert.isUndefined(signedTransaction)
  })

  it('Sign OfferCancel transaction with all fields', function (): void {
    // GIVEN an OfferCancel transaction with all fields, a wallet and expected signing artifacts.
    const wallet = new FakeWallet(fakeSignature)

    // Encode transaction with the expected signature.
    const expectedSignedTransactionJSON = Serializer.transactionToJSON(
      testTransactionOfferCancelAllFields,
      fakeSignature,
    )

    const expectedSignedTransactionHex = rippleCodec.encode(
      expectedSignedTransactionJSON,
    )
    const expectedSignedTransaction = Utils.toBytes(
      expectedSignedTransactionHex,
    )

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(
      testTransactionOfferCancelAllFields,
      wallet,
    )

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction)
    assert.deepEqual(signedTransaction, expectedSignedTransaction)
  })

  it('Sign OfferCreate transaction with all fields', function (): void {
    // GIVEN an OfferCreate transaction with all fields, a wallet and expected signing artifacts.
    const wallet = new FakeWallet(fakeSignature)

    // Encode transaction with the expected signature.
    const expectedSignedTransactionJSON = Serializer.transactionToJSON(
      testTransactionOfferCreateAllFields,
      fakeSignature,
    )

    const expectedSignedTransactionHex = rippleCodec.encode(
      expectedSignedTransactionJSON,
    )
    const expectedSignedTransaction = Utils.toBytes(
      expectedSignedTransactionHex,
    )

    // WHEN the transaction is signed with the wallet.
    const signedTransaction = Signer.signTransaction(
      testTransactionOfferCreateAllFields,
      wallet,
    )

    // THEN the signing artifacts are as expected.
    assert.exists(signedTransaction)
    assert.deepEqual(signedTransaction, expectedSignedTransaction)
  })
})
