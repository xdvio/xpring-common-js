import SignedTransaction from "../generated/signed_transaction_pb";
import Signer from "../src/signer";
import Transaction from "../generated/transaction_pb";
import Wallet from "./wallet";
import Utils from "./utils";
import grpc from "grpc";

/**
 * Exported classes.
 */
class XpringCommon {
  public static readonly SignedTransaction = SignedTransaction;
  public static readonly Signer = Signer;
  public static readonly Transaction = Transaction;
  public static readonly Utils = Utils;
  public static readonly Wallet = Wallet;
  public static readonly grpc = grpc;
}

export default XpringCommon;
