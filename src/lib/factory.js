import { stringToArrayBuffer } from "./utilities";

export default type => {
  const types = ["aes-gcm", "rsa-oaep"];
  type = type.toLowerCase();

  switch (type) {
    case "aes-gcm":
      return {
        /**
         * @returns {PromiseLike<CryptoKey>}
         */
        generateKey: () =>
          window.crypto.subtle.generateKey(
            {
              name: "AES-GCM",
              length: 256
            },
            true,
            ["encrypt", "decrypt"]
          ),
        /**
         * @param key {arrayBuffer}
         * @returns {PromiseLike<CryptoKey>}
         */
        importKey: key =>
          window.crypto.subtle.importKey(
            "raw",
            key,
            { name: "AES-GCM" },
            false,
            ["decrypt"]
          ),
        /**
         *
         * @param key {CryptoKey}
         * @returns {PromiseLike<ArrayBuffer>}
         */
        exportKey: key => window.crypto.subtle.exportKey("raw", key),
        /**
         * @param key {CryptoKey}
         * @param iv {arrayBuffer}
         * @param data {arrayBuffer}
         * @returns {PromiseLike<ArrayBuffer>}
         */
        encrypt: (key, iv, data) =>
          window.crypto.subtle.encrypt(
            {
              name: "AES-GCM",
              iv
            },
            key,
            data
          ),
        /**
         * @param key {CryptoKey}
         * @param iv {arrayBuffer}
         * @param data {arrayBuffer}
         * @returns {PromiseLike<ArrayBuffer>}
         */
        decrypt: (key, iv, data) =>
          window.crypto.subtle.decrypt(
            {
              name: "AES-GCM",
              iv: new Uint8Array(iv)
            },
            key,
            data
          )
      };
    case "rsa-oaep":
      return {
        /**
         * @param bits {number}
         * @returns {PromiseLike<CryptoKeyPair>}
         */
        generateKey: (bits = 4096) =>
          window.crypto.subtle.generateKey(
            {
              name: "RSA-OAEP",
              modulusLength: bits,
              publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
              hash: { name: "SHA-256" }
            },
            false,
            ["encrypt", "decrypt"]
          ),
        /**
         *
         * @param key {arrayBuffer}
         * @returns {PromiseLike<CryptoKey>}
         */
        importKey: key =>
          window.crypto.subtle.importKey(
            "spki",
            key,
            { name: "RSA-OAEP", hash: { name: "SHA-256" } },
            false,
            ["encrypt"]
          ),
        /**
         * @param publicKey {CryptoKey}
         * @returns {PromiseLike<ArrayBuffer>}
         */
        exportKey: publicKey =>
          window.crypto.subtle.exportKey("spki", publicKey),
        /**
         * @param publicKey {CryptoKey}
         * @param jsonString {string}
         * @returns {PromiseLike<ArrayBuffer>}
         */
        encrypt: (publicKey, jsonString) => {
          const arrayBuffer = stringToArrayBuffer(jsonString);
          return window.crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            publicKey,
            arrayBuffer
          );
        },
        /**
         * @param privateKey {CryptoKey}
         * @param arrayBuffer {arrayBuffer}
         * @returns {PromiseLike<ArrayBuffer>}
         */
        decrypt: (privateKey, arrayBuffer) =>
          window.crypto.subtle.decrypt(
            { name: "RSA-OAEP" },
            privateKey,
            arrayBuffer
          )
      };
    default:
      throw {
        type: "Not found",
        message: `The algorythm you requested is not currently supported. 
        Supported are ${types.map(type => ` ${type}`)}.`
      };
  }
};
