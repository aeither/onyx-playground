import { ethrProvider, getEs256kPrivateKey } from "@/utils/helper";
import {
  EthrDIDMethod,
  KeyDIDMethod,
  createAndSignPresentationJWT,
  getSubjectFromVP,
} from "@jpmorganchase/onyx-ssi-sdk";
import { includes } from "lodash";

import { getEddsaPrivateKey, privateKeyBufferFromString } from "@/utils/helper";
import { NextApiRequest, NextApiResponse } from "next";

const HOLDER_EDDSA_PRIVATE_KEY = getEddsaPrivateKey("HOLDER_EDDSA_PRIVATE_KEY");
const HOLDER_ES256K_PRIVATE_KEY = getEs256kPrivateKey(
  "HOLDER_ES256K_PRIVATE_KEY"
);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const key = await createAndSignVp();

  res.status(200).json(key);
};

const createAndSignVp = async () => {
  // if (VC) {
  try {
    console.log("\nReading an existing signed VC JWT\n");
    const signedVcJwt =
      "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiUFJPT0ZfT0ZfTkFNRSJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJuYW1lIjoiSmVzc2llIERvZSJ9fSwic3ViIjoiZGlkOmtleTp6Nk1rZWZ6WFd6d01SMWRrVjFmWmdDWUZRY256UnZiRDZBTlUyRk5QZVZZaENkYkgiLCJqdGkiOiJkaWQ6a2V5Ono2TWtySnNYdjFFdEFUNUp3VFQzdDFtU05CenF6cjhla1lRanNDemRZeUNhelNiYiIsIm5iZiI6MTY5Njc2MjcwMCwiaXNzIjoiZGlkOmtleTp6Nk1rZm01S1VRdUYyTGR1UFVGSGNaTWRpNWpHMXNEcFliZ2pFMXZqcmdoOHAzdEEifQ.D1Aj3ogV0VM2qDT91IlpoD2_Q2EG8jr1FCZNNx1lq_shlrYSulja4dtDFdd9mn9FxobuddyDo81x3-yvxRpWCg";
    // const signedVcJwt = fs.readFileSync(
    //   path.resolve(VC_DIR_PATH, `${camelCase(VC)}.jwt`),
    //   "utf8"
    // );
    console.log(signedVcJwt);

    console.log("\nGeting User from VC\n");
    const holderDid = getSubjectFromVP(signedVcJwt);
    console.log(holderDid);

    if (includes(holderDid, "ethr")) {
      console.log("VC did method: did:ethr");

      const didEthr = new EthrDIDMethod(ethrProvider);
      const didWithKeys = await didEthr.generateFromPrivateKey(
        HOLDER_ES256K_PRIVATE_KEY
      );

      if (didWithKeys.did === holderDid) {
        console.log("\nCreating and signing the VP from VC\n");
        const signedVp = await createAndSignPresentationJWT(didWithKeys, [
          signedVcJwt,
        ]);
        console.log(signedVp);
        return signedVp;
      } else {
        console.log(
          "HOLDER_ES256K_PRIVATE_KEY cannot sign for this verifiable credentail\n"
        );
      }
    } else if (includes(holderDid, "key")) {
      console.log("\nVC did method: did:key\n");

      const didKey = new KeyDIDMethod();
      const didWithKeys = await didKey.generateFromPrivateKey(
        privateKeyBufferFromString(HOLDER_EDDSA_PRIVATE_KEY)
      );

      if (didWithKeys.did === holderDid) {
        console.log("\nCreating and signing the VP from VC\n");
        const signedVp = await createAndSignPresentationJWT(didWithKeys, [
          signedVcJwt,
        ]);
        console.log(signedVp);
        return signedVp;
      } else {
        console.log(
          "\nHOLDER_EDDSA_PRIVATE_KEY cannot sign for this verifiable credentail\n"
        );
      }
    }
  } catch (err) {
    console.log("\nFailed to fetch file\n");
    console.log(
      "\nTo run this script you must have a valid VC and a valid signed VC JWT\n"
    );
    console.log("\nPlease refer to issuer scripts to generate and sign a VC\n");
  }
};
