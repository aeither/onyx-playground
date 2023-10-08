import { KeyPair } from "@jpmorganchase/onyx-ssi-sdk";
import * as ed25519 from "@stablelib/ed25519";
import { randomBytes } from "crypto";
import { Wallet, ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

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

export const generateES256KKeyPair = async (): Promise<KeyPair> => {
  const account: Wallet = ethers.Wallet.createRandom();
  const { privateKey, compressedPublicKey } = account._signingKey();

  return {
    algorithm: KEY_ALG.ES256K,
    publicKey: compressedPublicKey,
    privateKey,
  };
};

export const getEs256kPrivateKey = (type: string) => {
  let privateKey: string | Uint8Array = "";

  console.log(`\nGenerating and saving private key for ${type}\n`);
  generateES256KKeyPair().then((didWithKeys) => {
    privateKey = didWithKeys.privateKey;
  });

  return privateKey;
};

//

const getParam = (name: string) => {
  const param = process.env[name];
  if (!param) {
    console.error(`\nConfig param '${name}' missing\n`);
    return null;
  }
  return param;
};

export const NETWORK_RPC_URL = getParam("NETWORK_RPC_URL");

export const provider = new ethers.providers.JsonRpcProvider(NETWORK_RPC_URL!);

//Provider configs
export const CHAIN_ID = parseInt(getParam("CHAIN_ID")!);
export const NETWORK_NAME = getParam("NETWORK_NAME");
export const REGISTRY_CONTRACT_ADDRESS = getParam("REGISTRY_CONTRACT_ADDRESS");

export const ethrProvider = {
  name: NETWORK_NAME!,
  chainId: CHAIN_ID,
  rpcUrl: NETWORK_RPC_URL!,
  registry: REGISTRY_CONTRACT_ADDRESS!,
  gasSource: "",
};
