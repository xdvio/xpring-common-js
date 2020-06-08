import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import * as rippleKeyPair from 'ripple-keypairs'

import Utils from '../Common/utils'

/**
 * An object which contains artifacts from generating a new wallet.
 */
export interface WalletGenerationResult {
  /** The newly generated Wallet. */
  wallet: Wallet

  /** The mnemonic used to generate the wallet. */
  mnemonic: string

  /** The derivation path used to generate the wallet. */
  derivationPath: string
}

/**
 * A wallet object that has an address and keypair.
 */
class Wallet {
  /**
   * The default derivation path to use with BIP44.
   */
  public static defaultDerivationPath = "m/44'/144'/0'/0/0"

  public readonly publicKey: string
  public readonly privateKey: string
  private readonly test: boolean

  /**
   * Create a new Wallet object.
   *
   * @param publicKey - The given public key for the wallet.
   * @param privateKey - The given private key for the wallet.
   * @param test - Whether the address is for use on a test network, defaults to `false`.
   */
  public constructor(publicKey: string, privateKey: string, test = false) {
    this.publicKey = publicKey
    this.privateKey = privateKey
    this.test = test
  }

  /**
   * Generate a new wallet hierarchical deterministic wallet with a random mnemonic and
   * default derivation path.
   *
   * Secure random number generation is used when entropy is omitted and when the runtime environment has the necessary support.
   * Otherwise, an error is thrown.
   *
   * Runtime environments that do not have secure random number generation should pass their own buffer of entropy.
   *
   * @param entropy - A optional hex string of entropy.
   * @param test - Whether the address is for use on a test network, defaults to `false`.
   * @returns Artifacts from the wallet generation.
   */
  public static generateRandomWallet(
    entropy: string | undefined = undefined,
    test = false,
  ): WalletGenerationResult | undefined {
    if (entropy && !Utils.isHex(entropy)) {
      return undefined
    }

    const mnemonic =
      entropy === undefined
        ? bip39.generateMnemonic()
        : bip39.entropyToMnemonic(entropy)
    const derivationPath = Wallet.defaultDerivationPath
    const wallet = Wallet.generateWalletFromMnemonic(
      mnemonic,
      derivationPath,
      test,
    )
    return wallet === undefined
      ? undefined
      : { wallet, mnemonic, derivationPath }
  }

  /**
   * Generate a new hierarchical deterministic wallet from a mnemonic and derivation path.
   *
   * @param mnemonic - The given mnemonic for the wallet.
   * @param derivationPath - The given derivation path to use. If undefined, the default path is used.
   * @param test - Whether the address is for use on a test network, defaults to `false`.
   * @returns A new wallet from the given mnemonic if the mnemonic was valid, otherwise undefined.
   */
  public static generateWalletFromMnemonic(
    mnemonic: string,
    derivationPath = Wallet.defaultDerivationPath,
    test = false,
  ): Wallet | undefined {
    // Validate mnemonic and path are valid.
    if (!bip39.validateMnemonic(mnemonic)) {
      return undefined
    }

    /* eslint-disable node/no-sync --
     * TODO:(@keefertaylor) To be fixed when we make a WalletFactory
     */
    const seed = bip39.mnemonicToSeedSync(mnemonic)
    /* eslint-enable node/no-sync */
    return Wallet.generateHDWalletFromSeed(seed, derivationPath, test)
  }

  /**
   * Generate a new hierarchical deterministic wallet from a seed and derivation path.
   *
   * @param seed - The given seed for the wallet.
   * @param derivationPath - The given derivation path to use. If undefined, the default path is used.
   * @param test - Whether the address is for use on a test network, defaults to `false`.
   * @returns A new wallet from the given mnemonic if the mnemonic was valid, otherwise undefined.
   */
  public static generateHDWalletFromSeed(
    seed: Buffer,
    derivationPath = Wallet.defaultDerivationPath,
    test = false,
  ): Wallet | undefined {
    const masterNode = bip32.fromSeed(seed)
    const node = masterNode.derivePath(derivationPath)
    if (node.privateKey === undefined) {
      return undefined
    }

    const publicKey = Wallet.hexFromBuffer(node.publicKey)
    const privateKey = Wallet.hexFromBuffer(node.privateKey)
    return new Wallet(publicKey, `00${privateKey}`, test)
  }

  /**
   * Generate a new wallet from the given seed.
   *
   * @deprecated Please use `WalletFactory` instead.
   *
   * @param seed - The given seed for the wallet.
   * @param test - Whether the address is for use on a test network, defaults to `false`.
   * @returns A new wallet from the given seed, or undefined if the seed was invalid.
   */
  public static generateWalletFromSeed(
    seed: string,
    test = false,
  ): Wallet | undefined {
    try {
      const keyPair = rippleKeyPair.deriveKeypair(seed)
      return new Wallet(keyPair.publicKey, keyPair.privateKey, test)
    } catch {
      return undefined
    }
  }

  /**
   * Converts a Buffer to an uppercase hexadecimal string.
   *
   * @param buffer - A Buffer to be converted to hexadecimal.
   *
   * @returns A hexadecimal string.
   */
  private static hexFromBuffer(buffer: Buffer): string {
    return buffer.toString('hex').toUpperCase()
  }

  /**
   * Gets the x-address associated with a given wallet instance.
   *
   * @returns A string representing the x-address of the wallet.
   */
  public getAddress(): string {
    const classicAddress = rippleKeyPair.deriveAddress(this.publicKey)
    const xAddress = Utils.encodeXAddress(classicAddress, undefined, this.test)
    if (xAddress === undefined) {
      throw new Error('Unknown error deriving address')
    }
    return xAddress
  }

  /**
   * Sign an arbitrary hex string.
   *
   * @param hex - An arbitrary hex string to sign.
   * @returns A signature in hexadecimal format if the input was valid, otherwise undefined.
   */
  public sign(hex: string): string | undefined {
    if (!Utils.isHex(hex)) {
      return undefined
    }
    return rippleKeyPair.sign(hex, this.privateKey)
  }

  /**
   * Verify a signature is valid for a message.
   *
   * @param message - A message in hex format.
   * @param signature - A signature in hex format.
   * @returns True if the signature is valid, otherwise false.
   */
  public verify(message: string, signature: string): boolean {
    if (!Utils.isHex(signature) || !Utils.isHex(message)) {
      return false
    }

    try {
      return rippleKeyPair.verify(message, signature, this.publicKey)
    } catch {
      // The ripple-key-pair module may throw errors for some signatures rather than returning false.
      // If an error was thrown then the signature is definitely not valid.
      return false
    }
  }
}

export default Wallet
