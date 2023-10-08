import { ethrProvider } from "@/utils/helper";
import {
  EthrDIDMethod,
  KeyDIDMethod,
  getCredentialsFromVP,
  getSupportedResolvers,
  verifyDIDs,
  verifyPresentationJWT,
} from "@jpmorganchase/onyx-ssi-sdk";
import { NextApiRequest, NextApiResponse } from "next";

const didKey = new KeyDIDMethod();
const didEthr = new EthrDIDMethod(ethrProvider);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { vp } = req.query;
  console.log("Parameter value:", vp);
  const verified = await verification(vp);

  res.status(200).json(verified);
};

const verification = async (vp: string | string[] | undefined) => {
  // Instantiating the didResolver
  const didResolver = getSupportedResolvers([didKey, didEthr]);

  try {
    console.log("\nReading an existing signed VP JWT\n");
    // const signedVpJwt = fs.readFileSync(
    //   path.resolve(VP_DIR_PATH, `${camelCase(VP)}.jwt`),
    //   "utf8"
    // );
    const signedVpJwt = vp as string;
    console.log(signedVpJwt);

    console.log("\nVerifying VP JWT\n");
    // Inovking the verification fuction from the sdk
    // To know more about verification and api reference please refer to readme in src > verifier > readme.md in the sdk
    const isVpJwtValid = await verifyPresentationJWT(signedVpJwt, didResolver);

    if (isVpJwtValid) {
      console.log("\nVP JWT is Valid\n");

      console.log("\nGetting VC JWT from VP\n");

      const vcJwt = getCredentialsFromVP(signedVpJwt)[0];

      try {
        console.log("\nVerifying VC\n");

        const vcVerified = await verifyDIDs(vcJwt, didResolver);
        console.log(`\nVerification status: ${vcVerified}\n`);
        return vcVerified;
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Invalid VP JWT");
    }
  } catch (err) {
    console.log("\nFailed to fetch file\n");
    console.log(
      "\nTo run this script you must have a valid VP and a valid signed VP JWT\n"
    );
    console.log("\nPlease refer to issuer scripts to generate and sign a VP\n");
  }
};
