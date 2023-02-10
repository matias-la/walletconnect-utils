import * as nacl from "tweetnacl";
import { fromMiliseconds } from "@walletconnect/time";
import {
  JWT_IRIDIUM_ALG,
  JWT_IRIDIUM_TYP,
  KEY_PAIR_SEED_LENGTH,
} from "./constants";

import {
  decodeIss,
  decodeJWT,
  encodeData,
  encodeIss,
  encodeJWT,
} from "./utils";

export function generateKeyPair(
  seed: Uint8Array = nacl.randomBytes(KEY_PAIR_SEED_LENGTH)
): nacl.SignKeyPair {
  return nacl.sign.keyPair.fromSeed(seed);
}

export async function signJWT(
  sub: string,
  aud: string,
  ttl: number,
  keyPair: nacl.SignKeyPair,
  iat: number = fromMiliseconds(Date.now())
) {
  const header = { alg: JWT_IRIDIUM_ALG, typ: JWT_IRIDIUM_TYP };
  const iss = encodeIss(keyPair.publicKey);
  const exp = iat + ttl;
  const payload = { iss, sub, aud, iat, exp };
  const data = encodeData({ header, payload });
  const signature = nacl.sign.detached(data, keyPair.secretKey);
  return encodeJWT({ header, payload, signature });
}

export async function verifyJWT(jwt: string) {
  const { header, payload, data, signature } = decodeJWT(jwt);
  if (header.alg !== JWT_IRIDIUM_ALG || header.typ !== JWT_IRIDIUM_TYP) {
    throw new Error("JWT must use EdDSA algorithm");
  }
  const publicKey = decodeIss(payload.iss);
  return nacl.sign.detached.verify(data, signature, publicKey);
}
