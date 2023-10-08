import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import CardLabel from "@/components/ui/CardLabel";
import Divider from "@/components/ui/Divider";
import { getNetworkName } from "@/utils/network";
import { LoginProps } from "@/utils/types";

const Onyx = ({ token, setToken }: LoginProps) => {
  const fetchBackend = async () => {
    try {
      const response = await fetch("/api/vc");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log("🚀 ~ file: GetIdToken.tsx:44 ~ fetchBackend ~ data:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Card>
      <CardHeader id="Wallet">Wallet</CardHeader>
      <CardLabel leftHeader="Status" isDisconnect />
      <div className="flex-row">
        <div className="green-dot" />
        <div className="connected">Connected to {getNetworkName()}</div>
      </div>
      <Divider />
      <CardLabel leftHeader="Address" />
      <div className="code">card label</div>
      <Divider />
      <CardLabel leftHeader="Balance" />
      <button
        onClick={() => {
          fetchBackend();
        }}
      >
        click me
      </button>
    </Card>
  );
};

export default Onyx;
