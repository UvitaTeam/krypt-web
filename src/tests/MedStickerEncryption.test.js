import {
  adamEncrypt,
  encrypt,
  decrypt,
  deriveKey,
  accessSignature
} from "../lib/MedStickerEncryption";
import { BRITNEY } from "../lib/constants";
import { arrayBufferToString, stringToArrayBuffer } from "../lib/utilities";

describe("MedStickerEncryption", () => {
  const expect = window.expect;
  it("ADAM: should encrypt data and decrypt it back", async () => {
    const originalString = "Encrypted secret message from adam";
    const buffer = stringToArrayBuffer(originalString);
    const { key, iv, version } = deriveKey("7i6XA2zz", "qmHuG263", "adam");

    const { data } = await adamEncrypt("7i6XA2zz", "qmHuG263", buffer);
    const arrayBufferData = await decrypt({ key, iv, version }, data);

    const result = arrayBufferToString(arrayBufferData);
    expect(result).to.deep.equal(originalString);
  });

  it("BRITNEY: should encrypt data and decrypt it back", async () => {
    const originalString = "Encrypted secret message from britney";
    const buffer = stringToArrayBuffer(originalString);
    const { key, iv, version } = deriveKey("7i6XA2zz", "qmHuG263", BRITNEY);

    const { data } = await encrypt("7i6XA2zz", "qmHuG263", buffer);
    const arrayBufferData = await decrypt({ key, iv, version }, data);

    const result = arrayBufferToString(arrayBufferData);
    expect(result).to.deep.equal(originalString);
  });

  it("should return a signature in the form of sha256+${base64EncodedSignature}", async () => {
    const { key, iv } = deriveKey("7i6XA2zz", "qmHuG263", BRITNEY);
    const salt = stringToArrayBuffer("811247BC075144859010335F20D28C5E");

    const signature = await accessSignature({ key, iv }, salt);
    expect(signature).to.be.a("string");
  });
});
