import argon2 from "react-native-argon2";
import AesGcmCrypto from "react-native-aes-gcm-crypto";

export const kdfoptions = {
  hashLength: 32,
  memory: 128 * 1024,
  parallelism: 4,
  mode: "argon2id",
  iterations: 5,
};

export const generateArgon2Key = async (
  password,
  salt,
  options = kdfoptions
) => {
  const { hashLength, memory, parallelism, mode, iterations } = options;
  console.log("generating key...");
  try {
    const key = await argon2(password, salt, {
      hashLength,
      memory,
      parallelism,
      mode,
      iterations,
    });
    return key;
  } catch (error) {
    console.error("Error generating key:", error);
    throw error;
  }
};

export const encryptDataAes = async (data, key) => {
  try {
    const base64Key = Buffer.from(key, "hex").toString("base64");
    console.log("base64Key:", base64Key);
    const { iv, tag, content } = await AesGcmCrypto.encrypt(
      data,
      false,
      base64Key
    );
    return { iv, tag, encryptedData: content };
  } catch (error) {
    console.error("Error encrypting data:", error);
    throw error;
  }
};

export const decryptKeystoreJson = async (password, encryptedKeystoreJson) => {
  console.log("Decrypting wallet with password:", password);

  const { Crypto } = encryptedKeystoreJson;
  const { ciphertext, kdf, kdfparams, cipher } = Crypto;
  const { salt } = kdfparams;
  const iv = Crypto.cipherparams.iv;
  const tag = Crypto.mac;

  console.log("ciphertext:", ciphertext);
  console.log("kdf:", kdf);
  console.log("kdfparams:", kdfparams);
  console.log("salt:", salt);
  console.log("iv:", iv);
  console.log("cipher:", cipher);
  console.log("tag:", tag);
  try {
    const { rawHash, encodedHash } = await generateArgon2Key(
      password,
      salt,
      kdfparams
    );
    console.log("rawHash:", rawHash);
    const base64Key = Buffer.from(rawHash, "hex").toString("base64");
    console.log("base64Key:", base64Key);
    const decryptedData = await AesGcmCrypto.decrypt(
      ciphertext,
      base64Key,
      iv,
      tag,
      false
    );
    console.log("decryptedData:", decryptedData);
    const parsedDecryptedData = JSON.parse(decryptedData);
    console.log("Parsed decrypted data:", parsedDecryptedData);
    return parsedDecryptedData;
  } catch (error) {
    console.error("Error decrypting wallet:", error);
    throw error;
  }
};
