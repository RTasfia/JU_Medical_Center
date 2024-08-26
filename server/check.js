// // const crypto = require('crypto');

// // // Encryption function
// // function encryptText(text, key) {
// //     const cipher = crypto.createCipher('aes-256-cbc', key);
// //     let encrypted = cipher.update(text, 'utf8', 'hex');
// //     encrypted += cipher.final('hex');
// //     return encrypted;
// // }

// // // Decryption function
// // function decryptText(encryptedText, key) {
// //     const decipher = crypto.createDecipher('aes-256-cbc', key);
// //     let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
// //     decrypted += decipher.final('utf8');
// //     return decrypted;
// // }

// // // Example usage
// // const key = 'mySecretKey'; // You should use a secure key management approach in a real scenario
// // const originalText = 'Hello, world!';
// // console.log('Original text:', originalText);

// // // Encrypt the text
// // const encryptedText = encryptText(originalText, key);
// // console.log('Encrypted text:', encryptedText);

// // // Decrypt the text
// // const decryptedText = decryptText(encryptedText, key);
// // console.log('Decrypted text:', decryptedText);



// // Function to encrypt text using a basic substitution cipher
// const encryptText = (text, shift) => {
//     let result = '';
//     for (let i = 0; i < text.length; i++) {
//       let charCode = text.charCodeAt(i);
//       if (charCode >= 65 && charCode <= 90) {
//         result += String.fromCharCode(((charCode - 65 + shift) % 26) + 65);
//       } else if (charCode >= 97 && charCode <= 122) {
//         result += String.fromCharCode(((charCode - 97 + shift) % 26) + 97);
//       } else {
//         result += text.charAt(i);
//       }
//     }
//     return result;
//   }
  
//   // Function to decrypt text encrypted using a basic substitution cipher
//   function decryptText(text, shift) {
//     let result = '';
//     for (let i = 0; i < text.length; i++) {
//       let charCode = text.charCodeAt(i);
//       if (charCode >= 65 && charCode <= 90) {
//         result += String.fromCharCode(((charCode - 65 + 23) % 26) + 65);
//       } else if (charCode >= 97 && charCode <= 122) {
//         result += String.fromCharCode(((charCode - 97 + 23) % 26) + 97);
//       } else {
//         result += text.charAt(i);
//       }
//     }
//     return result;
//   }
  
//   // Example usage

//   const original = "hello world"

//   console.log('Original text:', original);
  
//   // Encrypt the text with a shift of 3 (Caesar cipher)
//   const encrypted = encryptText(original, 3);
//   console.log('Encrypted text:', encrypted);
  
//   // Decrypt the encrypted text
//   const decrypted = decryptText(encrypted, 3);
//   console.log('Decrypted text:', decrypted);

//   const checkObj = {"name" : "Rifa", "age": "24"}
// const keys = Object.keys(checkObj);
// const values = Object.values(checkObj);
// const entries = Object.entries(checkObj);
// console.log(entries)


const crypto = require('crypto');

// Function to generate a consistent IV
function generateIv() {
    return Buffer.alloc(16, 0); // 16 bytes of zeros for AES-CBC
}

// Function to encrypt data using AES-CBC and a shared key
function encryptData(sharedKey, plaintext) {
    const iv = generateIv(); // Use the fixed IV
    const key = Buffer.from(sharedKey, 'hex').slice(0, 32); // Ensure the key is 32 bytes long

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted; // Return the encrypted data
}

// Function to decrypt data using AES-CBC and a shared key
function decryptData(sharedKey, encryptedData) {
    const iv = generateIv(); // Use the same fixed IV
    const key = Buffer.from(sharedKey, 'hex').slice(0, 32); // Ensure the key is 32 bytes long

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
function performEncryption() {
  // Generate ECDH keys for Alice
  const alice = crypto.createECDH('secp256k1');
  alice.generateKeys();

  // Generate ECDH keys for Bob
  const bob = crypto.createECDH('secp256k1');
  bob.generateKeys();

  // Derive a shared secret from Alice's perspective using Bob's public key
  const aliceSharedKey = alice.computeSecret(bob.getPublicKey(), null, 'hex');
  
  // Encrypt the data
  // const plaintext = "This is a secret message";
  const x = ["tahi", "rifa",'shoshee' ];
  const encryptedData = {}
  for(let i=0;i<x.length;i++)
  {
    encryptedData[i] = encryptData(aliceSharedKey, x[i]);
  }

  console.log('Shared Key (Alice):', aliceSharedKey); // Debug output
  console.log('Encrypted Data:', encryptedData);

  // Return encrypted data and shared key (for consistency check)
  return { encryptedData, aliceSharedKey };
}

function performDecryption(encryptedData, sharedKey) {
  // Decrypt the data using the provided shared key
  const decryptedData = decryptData(sharedKey, encryptedData);

  console.log('Shared Key (for decryption):', sharedKey); // Debug output
  console.log('Decrypted Data:', decryptedData);

  return decryptedData;
}
// Encrypt data
const { encryptedData, aliceSharedKey } = performEncryption();

// Decrypt data using the same shared key
for (let key in encryptedData) {
  if (encryptedData.hasOwnProperty(key)) { // Check if the property is directly on the object
      const decryptedData = performDecryption(encryptedData[key],aliceSharedKey);
      console.log(decryptedData)
  }
}
// const decryptedData = performDecryption(encryptedData, aliceSharedKey);
// console.log(decryptedData)