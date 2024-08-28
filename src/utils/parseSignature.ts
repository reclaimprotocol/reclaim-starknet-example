import { BigNumber } from "ethers";

export default function parseSignature(signature: any) {
  const rHex = "0x" + signature.slice(2, 66); // First 32 bytes (64 hex characters)
  const sHex = "0x" + signature.slice(66, 130); // Next 32 bytes (64 hex characters)
  const vHex = signature.slice(130, 132); // Last byte

  const r = rHex; // Keep r as a hexadecimal string
  const s = sHex; // Keep s as a hexadecimal string
  let v = parseInt(vHex, 16); // Convert v from hex to decimal

  // Ensure v is either 27 or 28
  if (v < 27) {
    v += 27;
  }

  return {
    r: r,
    s: s,
    v: v,
  };
}
