import Wallet from "../src/wallet";
import { assert } from "chai";
import "mocha";

/* eslint-disable @typescript-eslint/no-non-null-assertion */

/**
 * A mapping of input and expected outputs for BIP39 and BIP44.
 * @see https://iancoleman.io/bip39/#english
 */
const derivationPathTestCases = {
  index0: {
    mnemonic:
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
    derivationPath: "m/44'/144'/0'/0/0",
    expectedPublicKey:
      "031D68BC1A142E6766B2BDFB006CCFE135EF2E0E2E94ABB5CF5C9AB6104776FBAE",
    expectedPrivateKey:
      "0090802A50AA84EFB6CDB225F17C27616EA94048C179142FECF03F4712A07EA7A4",
    expectedAddress: "rHsMGQEkVNJmpGWs8XUBoTBiAAbwxZN5v3",
    messageHex: new Buffer("test message", "utf-8").toString("hex"),
    expectedSignature:
      "3045022100E10177E86739A9C38B485B6AA04BF2B9AA00E79189A1132E7172B70F400ED1170220566BD64AA3F01DDE8D99DFFF0523D165E7DD2B9891ABDA1944E2F3A52CCCB83A"
  },
  index1: {
    mnemonic:
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
    derivationPath: "m/44'/144'/0'/0/1",
    expectedPublicKey:
      "038BF420B5271ADA2D7479358FF98A29954CF18DC25155184AEAD05796DA737E89",
    expectedPrivateKey:
      "000974B4CFE004A2E6C4364CBF3510A36A352796728D0861F6B555ED7E54A70389",
    expectedAddress: "r3AgF9mMBFtaLhKcg96weMhbbEFLZ3mx17"
  }
};

describe("wallet", function(): void {
  it("generateRandomWallet", function(): void {
    // WHEN a new wallet is generated.
    const wallet = Wallet.generateRandomWallet();

    // THEN the result exists and has the default derivation path.
    assert.exists(wallet);
    assert.equal(
      wallet!.getDerivationPath(),
      Wallet.getDefaultDerivationPath()
    );
  });

  it("walletFromMnemonic - derivation path index 0", function(): void {
    // GIVEN a menmonic, derivation path and a set of expected outputs.
    const testData = derivationPathTestCases.index0;

    // WHEN a new wallet is generated with the mnemonic and derivation path.
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath
    )!;

    // THEN the wallet has the expected address and keys.
    assert.equal(wallet.getPrivateKey(), testData.expectedPrivateKey);
    assert.equal(wallet.getPublicKey(), testData.expectedPublicKey);
    assert.equal(wallet.getAddress(), testData.expectedAddress);
    assert.equal(wallet.getMnemonic(), testData.mnemonic);
    assert.equal(wallet.getDerivationPath(), testData.derivationPath);
  });

  it("walletFromMnemonic - derivation path index 1", function(): void {
    // GIVEN a menmonic, derivation path and a set of expected outputs.
    const testData = derivationPathTestCases.index1;

    // WHEN a new wallet is generated with the mnemonic and derivation path.
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath
    )!;

    // THEN the wallet has the expected address and keys.
    assert.equal(wallet.getPrivateKey(), testData.expectedPrivateKey);
    assert.equal(wallet.getPublicKey(), testData.expectedPublicKey);
    assert.equal(wallet.getAddress(), testData.expectedAddress);
    assert.equal(wallet.getMnemonic(), testData.mnemonic);
    assert.equal(wallet.getDerivationPath(), testData.derivationPath);
  });

  it("walletFromMnemonic - no derivation path", function(): void {
    // GIVEN a menmonic, derivation path and a set of expected outputs.
    const testData = derivationPathTestCases.index0;

    // WHEN a new wallet is generated with the mnemonic and an unspecified derivation path.
    const wallet = Wallet.generateWalletFromMnemonic(testData.mnemonic)!;

    // THEN the wallet has the expected address and keys from the input mnemonic at the default derivation path.
    assert.equal(wallet.getPrivateKey(), testData.expectedPrivateKey);
    assert.equal(wallet.getPublicKey(), testData.expectedPublicKey);
    assert.equal(wallet.getAddress(), testData.expectedAddress);
    assert.equal(wallet.getMnemonic(), testData.mnemonic);
    assert.equal(wallet.getDerivationPath(), Wallet.getDefaultDerivationPath());
  });

  it("walletFromMnemonic - invalid mnemonic", function(): void {
    // GIVEN an invalid mnemonic.
    const mnemonic = "xrp xrp xpr xpr xrp xrp xpr xpr xrp xrp xpr xpr";

    // WHEN a wallet is generated from the mnemonic.
    const wallet = Wallet.generateWalletFromMnemonic(mnemonic);

    // THEN the wallet is undefined.
    assert.isUndefined(wallet);
  });

  it("sign", function(): void {
    // GIVEN a wallet.
    const testData = derivationPathTestCases.index0;
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath
    )!;

    // WHEN the wallet signs a hex message.
    const signature = wallet.sign(testData.messageHex);

    // THEN the signature is as expected.
    assert.equal(signature, testData.expectedSignature);
  });

  it("sign - invalid hex", function(): void {
    // GIVEN a wallet and a non-hexadecimal message.
    const testData = derivationPathTestCases.index0;
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath
    )!;
    const message = "xrp";

    // WHEN the wallet signs a message.
    const signature = wallet.sign(message);

    // THEN the signature is undefined.
    assert.notExists(signature);
  });

  it("verify - valid signature", function(): void {
    // GIVEN a wallet and a message with a valid signature.
    const testData = derivationPathTestCases.index0;
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath
    )!;
    const message = testData.messageHex;
    const signature = testData.expectedSignature;

    // WHEN a message is verified.
    const isValid = wallet.verify(message, signature);

    // THEN the signature is deemed valid.
    assert.isTrue(isValid);
  });

  it("verify - invalid signature", function(): void {
    // GIVEN a wallet and a invalid signature.
    const testData = derivationPathTestCases.index0;
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath
    )!;
    const message = testData.messageHex;
    const signature = "DEADBEEF";

    // WHEN a message is verified.
    const isValid = wallet.verify(message, signature);

    // THEN the signature is deemed invalid.
    assert.isFalse(isValid);
  });

  it("verify - bad signature", function(): void {
    // GIVEN a wallet and a non hex signature.
    const testData = derivationPathTestCases.index0;
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath
    )!;
    const message = testData.messageHex;
    const signature = "xrp";

    // WHEN a message is verified.
    const isValid = wallet.verify(message, signature);

    // THEN the signature is deemed invalid.
    assert.isFalse(isValid);
  });

  it("verify - bad message", function(): void {
    // GIVEN a wallet and a non hex message.
    const testData = derivationPathTestCases.index0;
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath
    )!;
    const message = "xrp";
    const signature = testData.expectedSignature;

    // WHEN a message is verified.
    const isValid = wallet.verify(message, signature);

    // THEN the signature is deemed invalid.
    assert.isFalse(isValid);
  });

  it("signs and verifies an empty message", function(): void {
    // GIVEN a wallet and an empty message.
    const testData = derivationPathTestCases.index0;
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath
    )!;
    const message = "";

    // WHEN the message is verified.
    const signature = wallet.sign(message)!;
    const isValid = wallet.verify(message, signature);

    // THEN the signature is deemed valid.
    assert.isTrue(isValid);
  });

  it("fails to verify a bad signature on an empty string.", function(): void {
    // GIVEN a wallet and an empty message and an incorrect signature.
    const testData = derivationPathTestCases.index0;
    const wallet = Wallet.generateWalletFromMnemonic(
      testData.mnemonic,
      testData.derivationPath
    )!;
    const message = "";
    const signature = "DEADBEEF";

    // WHEN the message is verified.
    const isValid = wallet.verify(message, signature);

    // THEN the signature is deemed invalid.
    assert.isFalse(isValid);
  });
});