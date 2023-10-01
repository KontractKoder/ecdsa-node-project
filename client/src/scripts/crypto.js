import {secp256k1} from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';

function hashMessage(message) {
    const bytes = utf8ToBytes(message);
    const hash = keccak256(bytes);
  
    return hash;
}

function getPublicKey(privateKey){
    return toHex(secp256k1.getPublicKey(privateKey));
}

function signMessage(msgHash, privateKey) {
    const signature = secp256k1.sign(msgHash, privateKey);
       
    return signature;
} 

export { hashMessage, getPublicKey, signMessage }