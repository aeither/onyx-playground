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
  const { vc } = req.query;
  console.log("Parameter value:", vc);
  const key = await createAndSignVp(vc);

  res.status(200).json(key);
};

const createAndSignVp = async (vc: string | string[] | undefined) => {
  if (vc) {
    try {
      console.log("\nReading an existing signed VC JWT\n");
      const signedVcJwt = vc as string;
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
      console.log(
        "\nPlease refer to issuer scripts to generate and sign a VC\n"
      );
    }
  }
};
