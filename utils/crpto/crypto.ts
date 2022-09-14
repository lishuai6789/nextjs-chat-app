const AES_KEY = "fwfiw13!3134270,./\=-0-=~~~1`2`^&**"
import CryptoJS,  { AES } from "crypto-js"
export function AESEncrypt(token: string): string {
  return AES.encrypt(token, AES_KEY, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
}
export function AESDecrypt(str: string): string {
  return AES.decrypt(str, AES_KEY, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8)
}