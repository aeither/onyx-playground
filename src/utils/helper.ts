import { KeyPair } from "@jpmorganchase/onyx-ssi-sdk";
import * as ed25519 from "@stablelib/ed25519";
import { randomBytes } from "crypto";
import { Wallet, ethers } from "ethers";

export enum KEY_ALG {
  ES256K = "ES256K",
  EdDSA = "EdDSA",
}

// conversion
export const privateKeyBufferFromString = (
  privateKeyString: string
): Uint8Array => {
  const buffer: Buffer = Buffer.from(privateKeyString, "hex");
  return new Uint8Array(buffer);
};

// keygen
export const generateEdDSAKeyPair = (): KeyPair => {
  const seed = () => randomBytes(32);

  const key = ed25519.generateKeyPair({
    isAvailable: true,
    randomBytes: seed,
  });

  return {
    algorithm: KEY_ALG.EdDSA,
    publicKey: Buffer.from(key.publicKey).toString("hex"),
    privateKey: Buffer.from(key.secretKey).toString("hex"),
  };
};

export const getEddsaPrivateKey = (type: string) => {
  let privateKey;

  console.log(`\nGenerating and saving private key for ${type}\n`);
  privateKey = generateEdDSAKeyPair().privateKey;
  return privateKey as string;
};
