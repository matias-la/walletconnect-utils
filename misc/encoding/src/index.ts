import _isTypedArray from "is-typedarray";
import typedArrayToBuffer from "typedarray-to-buffer";

// -- Constants ------------------------------------------ //

const ENC_HEX = "hex";
const ENC_UTF8 = "utf8";
const ENC_BIN = "binary";

const TYPE_BUFFER = "buffer";
const TYPE_ARRAY = "array";
const TYPE_TYPED_ARRAY = "typed-array";
const TYPE_ARRAY_BUFFER = "array-buffer";

const STRING_ZERO = "0";

// -- Buffer --------------------------------------------- //

export function bufferToArray(buf: Buffer): Uint8Array {
  return new Uint8Array(buf);
}

export function bufferToHex(buf: Buffer, prefixed = false): string {
  const hex = buf.toString(ENC_HEX);
  return prefixed ? addHexPrefix(hex) : hex;
}

export function bufferToUtf8(buf: Buffer): string {
  return buf.toString(ENC_UTF8);
}

export function bufferToNumber(buf: Buffer): number {
  return buf.readUIntBE(0, buf.length);
}

// -- Uint8Array ----------------------------------------- //

export function arrayToBuffer(arr: Uint8Array): Buffer {
  return typedArrayToBuffer(arr);
}

export function arrayToHex(arr: Uint8Array, prefixed = false): string {
  return bufferToHex(arrayToBuffer(arr), prefixed);
}

export function arrayToUtf8(arr: Uint8Array): string {
  return bufferToUtf8(arrayToBuffer(arr));
}

export function arrayToNumber(arr: Uint8Array): number {
  return bufferToNumber(arrayToBuffer(arr));
}

// -- Hex ------------------------------------------------ //

export function hexToBuffer(hex: string): Buffer {
  return Buffer.from(removeHexPrefix(hex), ENC_HEX);
}

export function hexToArray(hex: string): Uint8Array {
  return bufferToArray(hexToBuffer(hex));
}

export function hexToUtf8(hex: string): string {
  return bufferToUtf8(hexToBuffer(hex));
}

export function hexToNumber(hex: string): number {
  return arrayToNumber(hexToArray(hex));
}

// -- Utf8 ----------------------------------------------- //

export function utf8ToBuffer(utf8: string): Buffer {
  return Buffer.from(utf8, ENC_UTF8);
}

export function utf8ToArray(utf8: string): Uint8Array {
  return bufferToArray(utf8ToBuffer(utf8));
}

export function utf8ToHex(utf8: string, prefixed = false): string {
  return bufferToHex(utf8ToBuffer(utf8), prefixed);
}

// -- Validators ----------------------------------------- //

export function isBinaryString(str: any): boolean {
  if (typeof str !== "string" || !new RegExp(/^[01]+$/).test(str)) {
    return false;
  }
  if (str.length % 8 !== 0) {
    return false;
  }
  return true;
}

export function isHexString(str: any, length?: number): boolean {
  if (typeof str !== "string" || !str.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }
  if (length && str.length !== 2 + 2 * length) {
    return false;
  }
  return true;
}

export function isBuffer(val: any): boolean {
  return Buffer.isBuffer(val);
}

export function isTypedArray(val: any): boolean {
  return _isTypedArray.strict(val) && !isBuffer(val);
}

export function isArrayBuffer(val: any): boolean {
  return (
    !isTypedArray(val) &&
    !isBuffer(val) &&
    typeof val.byteLength !== "undefined"
  );
}

export function getType(val: any) {
  if (isBuffer(val)) {
    return TYPE_BUFFER;
  } else if (isTypedArray(val)) {
    return TYPE_TYPED_ARRAY;
  } else if (isArrayBuffer(val)) {
    return TYPE_ARRAY_BUFFER;
  } else if (Array.isArray(val)) {
    return TYPE_ARRAY;
  } else {
    return typeof val;
  }
}

export function getEncoding(str: string) {
  if (isBinaryString(str)) {
    return ENC_BIN;
  }
  if (isHexString(str)) {
    return ENC_HEX;
  }
  return ENC_UTF8;
}

// -- Misc ----------------------------------------------- //

export function concatBuffers(...args: Buffer[]): Buffer {
  const result = Buffer.concat(args);
  return result;
}

export function concatArrays(...args: Uint8Array[]): Uint8Array {
  let result: number[] = [];
  args.forEach(arg => (result = result.concat(Array.from(arg))));
  return new Uint8Array([...result]);
}

export function trimLeft(data: Buffer, length: number): Buffer {
  const diff = data.length - length;
  if (diff > 0) {
    data = data.slice(diff);
  }
  return data;
}

export function trimRight(data: Buffer, length: number): Buffer {
  return data.slice(0, length);
}

export function calcByteLength(length: number, byteSize = 8): number {
  const remainder = length % byteSize;
  return remainder
    ? ((length - remainder) / byteSize) * byteSize + byteSize
    : length;
}

export function sanitizeBytes(
  str: string,
  byteSize = 8,
  padding = STRING_ZERO
): string {
  return padLeft(str, calcByteLength(str.length, byteSize), padding);
}

export function padLeft(
  str: string,
  length: number,
  padding = STRING_ZERO
): string {
  return padString(str, length, true, padding);
}

export function removeHexPrefix(hex: string): string {
  return hex.replace(/^0x/, "");
}

export function addHexPrefix(hex: string): string {
  return hex.startsWith("0x") ? hex : `0x${hex}`;
}

export function sanitizeHex(hex: string): string {
  hex = removeHexPrefix(hex);
  hex = sanitizeBytes(hex, 2);
  if (hex) {
    hex = addHexPrefix(hex);
  }
  return hex;
}

export function removeHexLeadingZeros(hex: string): string {
  const prefixed = hex.startsWith("0x");
  hex = removeHexPrefix(hex);
  hex = hex.startsWith(STRING_ZERO) ? hex.substring(1) : hex;
  return prefixed ? addHexPrefix(hex) : hex;
}

// -- Private ----------------------------------------------- //

function padString(
  str: string,
  length: number,
  left: boolean,
  padding = STRING_ZERO
): string {
  const diff = length - str.length;
  let result = str;
  if (diff > 0) {
    const pad = padding.repeat(diff);
    result = left ? pad + str : str + pad;
  }
  return result;
}
