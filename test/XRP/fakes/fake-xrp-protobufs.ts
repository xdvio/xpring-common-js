/* eslint-disable max-lines -- lots of test data */
/* eslint-disable max-len -- long variable names and function names */
import { AccountAddress } from '../../../src/XRP/generated/org/xrpl/rpc/v1/account_pb'
import {
  CurrencyAmount,
  XRPDropsAmount,
  IssuedCurrencyAmount,
  Currency,
} from '../../../src/XRP/generated/org/xrpl/rpc/v1/amount_pb'
import {
  Destination,
  Sequence,
  Account,
  Amount,
  DestinationTag,
  InvoiceID,
  DeliverMin,
  SendMax,
  MemoData,
  LastLedgerSequence,
  SourceTag,
  ClearFlag,
  Domain,
  EmailHash,
  MessageKey,
  SetFlag,
  TickSize,
  TransferRate,
} from '../../../src/XRP/generated/org/xrpl/rpc/v1/common_pb'
import {
  AccountSet,
  Payment,
  Transaction,
  Memo,
} from '../../../src/XRP/generated/org/xrpl/rpc/v1/transaction_pb'
import xrpTestUtils from '../helpers/xrp-test-utils'

// Constant generator
/**
 * Helper function for generating sample data.
 *
 * @param arrayLength - The desired array length.
 * @param startValue - The first value in the array.
 *
 * @returns A UInt8Array with random data with the given length.
 */
function generateValidUint8Array(
  arrayLength: number,
  startValue = 0,
): Uint8Array {
  const numbers = new Array(arrayLength)
  for (let index = startValue; index < arrayLength; index++) {
    numbers[index] = index + 1
  }
  return new Uint8Array(numbers)
}

// Constants
const fakeSignature = 'DEADBEEF'
const value = '1000'
const currencyName = 'BTC'
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- sample data
const currencyCode1 = generateValidUint8Array(5)
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- sample data
const currencyCode2 = generateValidUint8Array(5, 4)
const issuedCurrencyValue = '100'
const destinationAddress = 'XVPcpSm47b1CZkf5AkKM9a84dQHe3m4sBhsrA4XtnBECTAc'
const issuerAddress = 'rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY'
const address1 = 'rQ3fNyLjbvcDaPNS4EAJY8aT9zR3uGk17c'
const address2 = 'r4L6ZLHkTytPqDR81H1ysCr6qGv9oJJAKi'
const address3 = 'rBM3QGATGQHRCBU8KtAvNvSHZrbJhMhWxA'
const invalidAddress = 'badAddress'
const fee = '10'
const sequenceNumber = 1
const account = 'X7vjQVCddnQ7GCESYnYR3EdpzbcoAMbPw7s2xv8YQs94tv4'
// invoiceId value should be either a base64 string or a 32-byte array representing 64 hex chars (256 bits)
const invoiceIdValue = 'ungWv48Bz+pBQUDeXa4iI7ADYaOWF3qctBD/YfIAFa0='
const deliverMinValue = '10'
const sendMaxValue = '13'
const destinationTagValue = 4
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- sample data
const testMemoData = generateValidUint8Array(3, 10)
const sourceTagValue = 5
const lastLedgerSequenceValue = 78652515
const clearFlagValue = 5
const domainValue = 'testdomain'
const HASH_LENGTH = 16
const emailHashValue = generateValidUint8Array(HASH_LENGTH)
// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- sample data
const messageKeyValue = generateValidUint8Array(3)
const setFlagValue = 4
const transferRateValue = 1234567890
const transferRateValueNoFee = 0
const tickSizeValue = 7
const tickSizeValueDisable = 0

// Objects for Transactions

// AccountAddress
const destinationAccountAddress = new AccountAddress()
destinationAccountAddress.setAddress(destinationAddress)

const issuerAccountAddress = new AccountAddress()
issuerAccountAddress.setAddress(issuerAddress)

const invalidAccountAddress = new AccountAddress()
invalidAccountAddress.setAddress(invalidAddress)

const senderAccountAddress = new AccountAddress()
senderAccountAddress.setAddress(account)

// Account
const accountProto = new Account()
accountProto.setValue(senderAccountAddress)

// Destination
const destination = new Destination()
destination.setValue(destinationAccountAddress)

const invalidDestination = new Destination()
invalidDestination.setValue(invalidAccountAddress)

// DestinationTag
const destinationTag = new DestinationTag()
destinationTag.setValue(destinationTagValue)

// Currency/XRP/IssuedCurrency
const testCurrencyProto = new Currency()
testCurrencyProto.setName(currencyName)

const paymentAmount = new XRPDropsAmount()
paymentAmount.setDrops(value)

const issuedCurrencyAmount = new IssuedCurrencyAmount()
issuedCurrencyAmount.setCurrency(testCurrencyProto)
issuedCurrencyAmount.setIssuer(issuerAccountAddress)
issuedCurrencyAmount.setValue(issuedCurrencyValue)

// CurrencyAmount
const currencyAmountXrp = new CurrencyAmount()
currencyAmountXrp.setXrpAmount(paymentAmount)

const currencyAmountIssuedCurrency = new CurrencyAmount()
currencyAmountIssuedCurrency.setIssuedCurrencyAmount(issuedCurrencyAmount)

// Amount
const amountXrp = new Amount()
amountXrp.setValue(currencyAmountXrp)

const amountIssuedCurrency = new Amount()
amountIssuedCurrency.setValue(currencyAmountIssuedCurrency)

// ClearFlag
const clearFlag = new ClearFlag()
clearFlag.setValue(clearFlagValue)

// DeliverMin
const deliverMin = new DeliverMin()
deliverMin.setValue(xrpTestUtils.makeXrpCurrencyAmount(deliverMinValue))

// Domain
const domain = new Domain()
domain.setValue(domainValue)

// EmailHash
const emailHash = new EmailHash()
emailHash.setValue(emailHashValue)

// InvoiceID
const invoiceId = new InvoiceID()
invoiceId.setValue(invoiceIdValue)

// SendMax
const sendMax = new SendMax()
sendMax.setValue(xrpTestUtils.makeXrpCurrencyAmount(sendMaxValue))

// Sequence
const sequenceProto = new Sequence()
sequenceProto.setValue(sequenceNumber)

// Transaction Fee
const transactionFeeProto = new XRPDropsAmount()
transactionFeeProto.setDrops(fee)

// LastLedgerSequence
const lastLedgerSequence = new LastLedgerSequence()
lastLedgerSequence.setValue(lastLedgerSequenceValue)

// Memo
const memoData = new MemoData()
memoData.setValue(testMemoData)

const memo = new Memo()
memo.setMemoData(memoData)

// MessageKey
const messageKey = new MessageKey()
messageKey.setValue(messageKeyValue)

// SetFlag
const setFlag = new SetFlag()
setFlag.setValue(setFlagValue)

// SourceTag
const sourceTag = new SourceTag()
sourceTag.setValue(sourceTagValue)

// TransferRate
const transferRate = new TransferRate()
transferRate.setValue(transferRateValue)

const transferRateNoFee = new TransferRate()
transferRateNoFee.setValue(transferRateValueNoFee)

// TickSize
const tickSize = new TickSize()
tickSize.setValue(tickSizeValue)

const tickSizeDisable = new TickSize()
tickSizeDisable.setValue(tickSizeValueDisable)

// PathElements and Paths
const path1Element1 = xrpTestUtils.makePathElement(
  xrpTestUtils.makeAccountAddress(address1),
  currencyCode1,
  xrpTestUtils.makeAccountAddress(address2),
)
const path1Element2 = xrpTestUtils.makePathElement(
  xrpTestUtils.makeAccountAddress(address3),
  currencyCode2,
  xrpTestUtils.makeAccountAddress(address2),
)

const path1 = new Payment.Path()
path1.addElements(path1Element1)
path1.addElements(path1Element2)

const path2Element1 = xrpTestUtils.makePathElement(
  xrpTestUtils.makeAccountAddress(address1),
  currencyCode1,
  xrpTestUtils.makeAccountAddress(address3),
)

const path2 = new Payment.Path()
path2.addElements(path2Element1)

const pathList = [path1, path2]

// AccountSets

const accountSetAllFields = new AccountSet()
accountSetAllFields.setClearFlag(clearFlag)
accountSetAllFields.setDomain(domain)
accountSetAllFields.setEmailHash(emailHash)
accountSetAllFields.setMessageKey(messageKey)
accountSetAllFields.setSetFlag(setFlag)
accountSetAllFields.setTransferRate(transferRate)
accountSetAllFields.setTickSize(tickSize)

const accountSetOneFieldSet = new AccountSet()
accountSetOneFieldSet.setClearFlag(clearFlag)

const accountSetEmpty = new AccountSet()

const accountSetSpecialCases = new AccountSet()
accountSetSpecialCases.setTransferRate(transferRateNoFee)
accountSetSpecialCases.setTickSize(tickSizeDisable)

// Payments
const paymentMandatoryFields = new Payment()
paymentMandatoryFields.setDestination(destination)
paymentMandatoryFields.setAmount(amountXrp)

const paymentMandatoryFieldsIssuedCurrency = new Payment()
paymentMandatoryFieldsIssuedCurrency.setDestination(destination)
paymentMandatoryFieldsIssuedCurrency.setAmount(amountIssuedCurrency)

const paymentAllFields = new Payment()
paymentAllFields.setDestination(destination)
paymentAllFields.setAmount(amountXrp)
paymentAllFields.setDestinationTag(destinationTag)
paymentAllFields.setInvoiceId(invoiceId)
paymentAllFields.setDeliverMin(deliverMin)
paymentAllFields.setSendMax(sendMax)
paymentAllFields.setPathsList(pathList)

// Transaction

/**
 * Helper function to generate Transaction objects with the standard values from Payment objects.
 * There must be at most one of accountSet or payment.
 *
 * @param accountSet -AccountSet object to insert into the transaction.
 * @param payment -Payment object to insert into the transaction.
 * @returns Payment Transaction with the included payment param.
 */
function buildStandardTestTransaction(
  accountSet?: AccountSet,
  payment?: Payment,
): Transaction {
  const transaction = new Transaction()
  transaction.setAccount(accountProto)
  transaction.setFee(transactionFeeProto)
  transaction.setSequence(sequenceProto)
  if (accountSet) {
    transaction.setAccountSet(accountSet)
  }
  if (payment) {
    transaction.setPayment(payment)
  }
  return transaction
}

// AccountSet Transactions
const testTransactionAccountSetAllFields = buildStandardTestTransaction(
  accountSetAllFields,
  undefined,
)
const testTransactionAccountSetOneField = buildStandardTestTransaction(
  accountSetOneFieldSet,
  undefined,
)
const testTransactionAccountSetEmpty = buildStandardTestTransaction(
  accountSetEmpty,
  undefined,
)
const testTransactionAccountSetSpecialCases = buildStandardTestTransaction(
  accountSetSpecialCases,
  undefined,
)

// Payment Transactions
const testTransactionPaymentMandatoryFields = buildStandardTestTransaction(
  undefined,
  paymentMandatoryFields,
)
const testTransactionPaymentMandatoryFieldsIssuedCurrency = buildStandardTestTransaction(
  undefined,
  paymentMandatoryFieldsIssuedCurrency,
)
const testTransactionPaymentAllFields = buildStandardTestTransaction(
  undefined,
  paymentAllFields,
)
testTransactionPaymentAllFields.addMemos(memo)
testTransactionPaymentAllFields.setLastLedgerSequence(lastLedgerSequence)
testTransactionPaymentAllFields.setSourceTag(sourceTag)

// INVALID OBJECTS =============================================

// Invalid Payments
const testInvalidPaymentNoAmount = new Payment()
testInvalidPaymentNoAmount.setDestination(destination)

const testInvalidPaymentNoDestination = new Payment()
testInvalidPaymentNoDestination.setAmount(amountIssuedCurrency)

const testInvalidPaymentBadDestination = new Payment()
testInvalidPaymentBadDestination.setAmount(amountIssuedCurrency)
testInvalidPaymentBadDestination.setDestination(invalidDestination)

const testInvalidPaymentNoSendMax = new Payment()
testInvalidPaymentNoSendMax.setAmount(amountIssuedCurrency)
testInvalidPaymentNoSendMax.setDestination(destination)

// Invalid Transactions
const testInvalidTransactionPaymentNoAmount = buildStandardTestTransaction(
  undefined,
  testInvalidPaymentNoAmount,
)
const testInvalidTransactionPaymentNoDestination = buildStandardTestTransaction(
  undefined,
  testInvalidPaymentNoDestination,
)
const testInvalidTransactionPaymentBadDestination = buildStandardTestTransaction(
  undefined,
  testInvalidPaymentBadDestination,
)

const testInvalidTransactionPaymentNoAccount = new Transaction()
testInvalidTransactionPaymentNoAccount.setFee(transactionFeeProto)
testInvalidTransactionPaymentNoAccount.setSequence(sequenceProto)
testInvalidTransactionPaymentNoAccount.setPayment(paymentMandatoryFields)

const testInvalidTransactionPaymentNoFee = new Transaction()
testInvalidTransactionPaymentNoFee.setAccount(accountProto)
testInvalidTransactionPaymentNoFee.setSequence(sequenceProto)
testInvalidTransactionPaymentNoFee.setPayment(paymentMandatoryFields)

const testInvalidTransactionPaymentNoPayment = new Transaction()
testInvalidTransactionPaymentNoPayment.setAccount(accountProto)
testInvalidTransactionPaymentNoPayment.setFee(transactionFeeProto)
testInvalidTransactionPaymentNoPayment.setSequence(sequenceProto)

export {
  fakeSignature,
  testTransactionPaymentMandatoryFields,
  testTransactionPaymentMandatoryFieldsIssuedCurrency,
  testTransactionPaymentAllFields,
  testInvalidTransactionPaymentNoAmount,
  testInvalidTransactionPaymentNoDestination,
  testInvalidTransactionPaymentBadDestination,
  testInvalidTransactionPaymentNoAccount,
  testInvalidTransactionPaymentNoFee,
  testInvalidTransactionPaymentNoPayment,
  testTransactionAccountSetAllFields,
  testTransactionAccountSetOneField,
  testTransactionAccountSetEmpty,
  testTransactionAccountSetSpecialCases,
}
