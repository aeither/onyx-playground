import { getEddsaPrivateKey, privateKeyBufferFromString } from "@/utils/helper";
import {
  KeyDIDMethod,
  createAndSignCredentialJWT,
} from "@jpmorganchase/onyx-ssi-sdk";
import { NextApiRequest, NextApiResponse } from "next";

// {
//   "ISSUER_EDDSA_PRIVATE_KEY": "92dfd79dde2e107b4d133cce8ca99698c6a4cbefa1379613b14fa9418432695d136c036c4eae1af585006e9565871c575fcfb8367afd8120e97aa04913c759e7",
//   "HOLDER_EDDSA_PRIVATE_KEY": "e43788afa28a6b0de2bb6a02d5e9abccfdc03355e1322e4b899a8b757daf052f034300f1d089ead4646aa91732a4fdcf00b3faeb6d38a610880b1d6e047984ec",
//   "ISSUER_ES256K_PRIVATE_KEY": "0x2368f01f4943504e7c39356f30613e725a9af8b817b9be3e23eeeecc928de688",
//   "HOLDER_ES256K_PRIVATE_KEY": "0x39229e9345f1c7282827a99d22f95dbb4c6fba18c7290cf901685b8492cadd96"
// }

const HOLDER_EDDSA_PRIVATE_KEY =
  "e43788afa28a6b0de2bb6a02d5e9abccfdc03355e1322e4b899a8b757daf052f034300f1d089ead4646aa91732a4fdcf00b3faeb6d38a610880b1d6e047984ec" ||
  getEddsaPrivateKey("HOLDER_EDDSA_PRIVATE_KEY");
const ISSUER_EDDSA_PRIVATE_KEY =
  "92dfd79dde2e107b4d133cce8ca99698c6a4cbefa1379613b14fa9418432695d136c036c4eae1af585006e9565871c575fcfb8367afd8120e97aa04913c759e7" ||
  getEddsaPrivateKey("ISSUER_EDDSA_PRIVATE_KEY");

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
