import { BigNumber } from "ethers";
import parseSignature from "./parseSignature";

export default function transformProof(oldProof: any) {
  const identifierBN = BigNumber.from(oldProof.identifier);

  const newProof = {
    proof: {
      id: 0,
      claim_info: {
        provider: oldProof.claimData.provider,
        parameters: oldProof.claimData.parameters,
        context: oldProof.claimData.context,
      },
      signed_claim: {
        claim: {
          identifier: `0x${identifierBN.toHexString().slice(2)}`,
          byte_identifier: oldProof.identifier,
          owner: oldProof.claimData.owner,
          epoch: oldProof.claimData.epoch.toString(),
          timestamp_s: oldProof.claimData.timestampS.toString(),
        },
        signatures: oldProof.signatures.map((sig: any) => {
          const parsedSig = parseSignature(sig);
          return {
            r: `0x${BigNumber.from(parsedSig.r).toHexString().slice(2)}`,
            s: `0x${BigNumber.from(parsedSig.s).toHexString().slice(2)}`,
            v: parsedSig.v,
          };
        }),
      },
    },
  };

  return newProof;
}
