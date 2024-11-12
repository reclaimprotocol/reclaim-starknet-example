import { useState, useEffect, useMemo } from "react";
import { Button } from "./components/ui/Button";
import { useAccount } from "@starknet-react/core";
import transformProof from "./utils/transformProof";
import { RpcProvider, Contract, Account, ec, json } from "starknet";
import { ClipLoader } from "react-spinners";

export default function VerifyProof(props: any) {
  const { account } = useAccount();
  const [proof, setProof] = useState({});
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const handleVerifyProof = async () => {
    try {
      setLoading(true);
      const provider = new RpcProvider({
        nodeUrl: "https://starknet-sepolia.public.blastapi.io",
      });
      const reclaimAddress =
        "0x0765f3f940f7c59288b522a44ac0eeba82f8bf71dd03e265d2c9ba3521466b4e"; // Replace with your contract address

      const { abi: reclaimAbi } = await provider.getClassAt(reclaimAddress);
      if (reclaimAbi === undefined) {
        throw new Error("no abi.");
      }
      const ReclaimContract = new Contract(
        reclaimAbi,
        reclaimAddress,
        provider
      );
      // @ts-ignore
      ReclaimContract.connect(account);
      const myCall = ReclaimContract.populate("verify_proof", proof);
      const res = await ReclaimContract.verify_proof(myCall.calldata);

      let hash = await provider.waitForTransaction(res.transaction_hash);
      setLoading(false);
      // @ts-ignore
      setTransactionHash(hash.transaction_hash);
      setVerified(true);
      console.log("hash", hash);
    } catch (error) {
      console.error("Verification failed:", error);
      setLoading(false);
      setError("Verification failed. Please try again.");
      setVerified(false);
    }
  };

  useEffect(() => {
    const transformedProof = transformProof(props.proof);
    setProof(transformedProof);
  }, [props.proof]);

  return (
    <div>
      {!loading && !verified && (
        <Button onClick={handleVerifyProof}>Verify Proof</Button>
      )}
      {loading && <ClipLoader color="#4A90E2" size={50} />}
      {verified && transactionHash && (
        <div className="flex flex-col text-center">
          <p className="text-green-500 font-semibold">
            Verification completed.
          </p>
          <a
            href={`https://sepolia.starkscan.co/tx/${transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400"
          >
            See Transaction on the Explorer
          </a>
        </div>
      )}
      {error && <p className="text-red-500 font-semibold">{error}</p>}
    </div>
  );
}
