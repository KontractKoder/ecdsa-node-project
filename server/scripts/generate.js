/*
Demonstrate Public Key Cryptography using ECDSA (Elliptic Curve Digital Signature Algorithm)
Generate a random private key, a public key and an address 
Test all cyptography methods including sign, verify, recoverPublicKey
*/
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes,  toHex } = require("ethereum-cryptography/utils");


    const privateKey = secp.secp256k1.utils.randomPrivateKey();
    console.log('private key: ' + toHex(privateKey));
    
    const publicKey = secp.secp256k1.getPublicKey(privateKey);
    console.log('public key bytes: ' + publicKey); 
    console.log('public key: ' + toHex(publicKey)); 
   
    const address = keccak256(publicKey.slice(1).slice(-20));
    console.log('address: ','0x' + toHex(address));
    console.log('address bytes: ' + address);
   
    const message = 'Alchemy University is Awsome!';
    const msgBytes = utf8ToBytes(message);
    const msgHashed = keccak256(msgBytes);
    console.log('msgHashed: ' + toHex(msgHashed));
    
    const msgSigned = secp.secp256k1.sign(msgHashed, privateKey);
    console.log("msgSigned: " + msgSigned); 
    console.log("recovery bit: ", msgSigned.recovery);
     
    //console.log("signature recoveryBit : " + msgSigned.r);  

    const isValid = secp.secp256k1.verify(msgSigned, msgHashed, publicKey);
    console.log('signature is valid: ' + isValid);
    
    const recoveredPublicKey = msgSigned.recoverPublicKey(msgHashed).toHex();
    console.log('recovered public key from signature: ' + recoveredPublicKey);

    if (toHex(publicKey) === recoveredPublicKey) {
        console.log('recovered public key matches original public key! :)');
    } else {
        console.log('recoverd public key is NOT a match to original :(');
    }

    
