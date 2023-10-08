import React, { useCallback, useState } from "react";
import { useMagic } from "../MagicProvider";
import showToast from "@/utils/showToast";
import Spinner from "@/components/ui/Spinner";

const GetIdToken = () => {
  const { magic } = useMagic();
  const [disabled, setDisabled] = useState(false);

  const getWalletType = useCallback(async () => {
    if (!magic) return;
    try {
      setDisabled(true);
      const idToken = await magic.user.getIdToken();
      setDisabled(false);
      console.log("ID Token: " + idToken);
      showToast({
        message: "Please check console for the ID Token Log",
        type: "success",
      });
    } catch (error) {
      setDisabled(false);
      console.error(error);
    }
  }, [magic]);

  const getMetadata = async () => {
    if (!magic) return;

    const metadata = await magic.user.getMetadata();
    console.log(
      "🚀 ~ file: GetIdToken.tsx:31 ~ getMetadata ~ metadata:",
      metadata
    );
  };

  const fetchBackend = async () => {
    try {
      const response = await fetch("/api/issue");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log("🚀 ~ file: GetIdToken.tsx:44 ~ fetchBackend ~ data:", data)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <div className="wallet-method-container">
        <button onClick={fetchBackend}>Get fetchBackend</button>
      </div>
      <div className="wallet-method-container">
        <button onClick={getMetadata}>Get metadata</button>
      </div>
      <div className="wallet-method-container">
        <button
          className="wallet-method"
          onClick={getWalletType}
          disabled={disabled}
        >
          {disabled ? (
            <div className="loading-container w-[86px]">
              <Spinner />
            </div>
          ) : (
            "getIdToken()"
          )}
        </button>
        <div className="wallet-method-desc">
          Generates a Decentralized Id Token which acts as a proof of
          authentication to resource servers.
        </div>
      </div>
    </>
  );
};

export default GetIdToken;
