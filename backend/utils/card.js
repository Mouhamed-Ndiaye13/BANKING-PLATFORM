import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 16);

// Simule BIN Mastercard
export function generateCardToken() {
  // BIN Mastercard fictif : 5310-XX...
  const bin = "5310";
  const token = nanoid();
  return `${bin}${token}`.replace(/(.{4})/g, '$1 ');

}

export function getExpiration() {
  const now = new Date();
  const year = now.getFullYear() + 3;  
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${month}/${String(year).slice(-2)}`;
}
