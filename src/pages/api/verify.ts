import { ethrProvider } from "@/utils/helper";
import {
    EthrDIDMethod,
    KeyDIDMethod,
    getCredentialsFromVP,
    getSupportedResolvers,
    verifyDIDs,
    verifyPresentationJWT
} from "@jpmorganchase/onyx-ssi-sdk";
import { NextApiRequest, NextApiResponse } from "next";

const didKey = new KeyDIDMethod();
const didEthr = new EthrDIDMethod(ethrProvider);

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const verified = await verification();
  
    res.status(200).json(verified);
  };

const verification = async () => {
  // Instantiating the didResolver
  const didResolver = getSupportedResolvers([didKey, didEthr]);

  try {
    console.log("\nReading an existing signed VP JWT\n");
    // const signedVpJwt = fs.readFileSync(
    //   path.resolve(VP_DIR_PATH, `${camelCase(VP)}.jwt`),
    //   "utf8"
    // );
    const signedVpJwt =
      "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJ2cCI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVQcmVzZW50YXRpb24iXSwidmVyaWZpYWJsZUNyZWRlbnRpYWwiOlsiZXlKaGJHY2lPaUpGWkVSVFFTSXNJblI1Y0NJNklrcFhWQ0o5LmV5SjJZeUk2ZXlKQVkyOXVkR1Y0ZENJNld5Sm9kSFJ3Y3pvdkwzZDNkeTUzTXk1dmNtY3ZNakF4T0M5amNtVmtaVzUwYVdGc2N5OTJNU0pkTENKMGVYQmxJanBiSWxabGNtbG1hV0ZpYkdWRGNtVmtaVzUwYVdGc0lpd2lVRkpQVDBaZlQwWmZUa0ZOUlNKZExDSmpjbVZrWlc1MGFXRnNVM1ZpYW1WamRDSTZleUp1WVcxbElqb2lTbVZ6YzJsbElFUnZaU0o5ZlN3aWMzVmlJam9pWkdsa09tdGxlVHA2TmsxclpXWjZXRmQ2ZDAxU01XUnJWakZtV21kRFdVWlJZMjU2VW5aaVJEWkJUbFV5Ums1UVpWWlphRU5rWWtnaUxDSnFkR2tpT2lKa2FXUTZhMlY1T25vMlRXdHlTbk5ZZGpGRmRFRlVOVXAzVkZRemRERnRVMDVDZW5GNmNqaGxhMWxSYW5ORGVtUlplVU5oZWxOaVlpSXNJbTVpWmlJNk1UWTVOamMyTWpjd01Dd2lhWE56SWpvaVpHbGtPbXRsZVRwNk5rMXJabTAxUzFWUmRVWXlUR1IxVUZWR1NHTmFUV1JwTldwSE1YTkVjRmxpWjJwRk1YWnFjbWRvT0hBemRFRWlmUS5EMUFqM29nVjBWTTJxRFQ5MUlscG9EMl9RMkVHOGpyMUZDWk5OeDFscV9zaGxyWVN1bGphNGR0REZkZDltbjlGeG9idWRkeURvODF4My15dnhScFdDZyJdfSwiaXNzIjoiZGlkOmtleTp6Nk1rZWZ6WFd6d01SMWRrVjFmWmdDWUZRY256UnZiRDZBTlUyRk5QZVZZaENkYkgifQ.8A7ek9WedQmyZGiPhZ8bJN57FysKpFxo-yxtmaAKx1uTXKAxlwo3psX0615WDob9Sk6IUVyxIvoFGytu4TXAAQ";
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
        return vcVerified
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