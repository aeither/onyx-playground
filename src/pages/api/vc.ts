import { getEddsaPrivateKey, privateKeyBufferFromString } from "@/utils/helper";
import {
  KeyDIDMethod,
  createAndSignCredentialJWT,
} from "@jpmorganchase/onyx-ssi-sdk";
import { NextApiRequest, NextApiResponse } from "next";

const HOLDER_EDDSA_PRIVATE_KEY = getEddsaPrivateKey("HOLDER_EDDSA_PRIVATE_KEY");
const ISSUER_EDDSA_PRIVATE_KEY = getEddsaPrivateKey("ISSUER_EDDSA_PRIVATE_KEY");

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const key = await createVc();

  res.status(200).json(key);
};

const createVc = async () => {
  const didKey = new KeyDIDMethod();

  const issuerDidWithKeys = await didKey.generateFromPrivateKey(
    privateKeyBufferFromString(ISSUER_EDDSA_PRIVATE_KEY)
  );

  const holderDidWithKeys = await didKey.generateFromPrivateKey(
    privateKeyBufferFromString(HOLDER_EDDSA_PRIVATE_KEY)
  );

  const vcDidKey = (await didKey.create()).did;

  const credentialType = "PROOF_OF_NAME";

  const subjectData = {
    name: "Jessie Doe",
  };

  //vc id, expirationDate, credentialStatus, credentialSchema, etc
  const additionalParams = {
    id: vcDidKey,
  };

  console.log(
    `\nGenerating a signed verifiable Credential of type ${credentialType}\n`
  );

  const signedVc = await createAndSignCredentialJWT(
    issuerDidWithKeys,
    holderDidWithKeys.did,
    subjectData,
    [credentialType],
    additionalParams
  );

  console.log(signedVc);
  return signedVc;
};
