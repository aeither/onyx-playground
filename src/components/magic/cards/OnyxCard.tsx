import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import CardLabel from "@/components/ui/CardLabel";
import Divider from "@/components/ui/Divider";
import { getNetworkName } from "@/utils/network";
import { LoginProps } from "@/utils/types";
import { useState } from "react";

const Onyx = ({ token, setToken }: LoginProps) => {
  const [vc, setVc] = useState("Not generated");
  const [vp, setVp] = useState("Not generated");

  const getVc = async () => {
    try {
      const response = await fetch("/api/vc");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log("🚀 ~ file: GetIdToken.tsx:44 ~ fetchBackend ~ data:", data);
      setVc(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getVp = async () => {
    try {
      const options = {}; // Add your desired options here

      const response = await fetch(
        `http://localhost:3000/api/vp?vc=${vc}`,
        options
      );
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card>
      <CardHeader id="Wallet">Onyx</CardHeader>
      {/* <CardLabel leftHeader="Status"  />
      <div className="flex-row">
        <div className="green-dot" />
        <div className="connected">Connected to {getNetworkName()}</div>
      </div> */}
      {/* <Divider /> */}

      <CardLabel leftHeader="Issuer" />
      <button
        className="form-button"
        onClick={() => {
          getVc();
        }}
      >
        Create and sign VC
      </button>

      <Divider />

      <CardLabel leftHeader="VC" />
      <div className="code">{vc}</div>

      <Divider />

      <CardLabel leftHeader="Holder" />
      <button
        className="form-button"
        onClick={() => {
          getVp();
        }}
      >
        Create and sign VP
      </button>

      <Divider />

      <CardLabel leftHeader="VP" />
      <div className="code">{vp}</div>
    </Card>
  );
};

export default Onyx;
