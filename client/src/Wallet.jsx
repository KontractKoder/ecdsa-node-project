import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex } from "ethereum-cryptography/utils";


function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  
  async function onChange(evt) {
    try {
      

      const privateKey = evt.target.value;
      setPrivateKey(privateKey);
      console.log('private key hex: ',privateKey);    
      
      let address = toHex(secp.secp256k1.getPublicKey(privateKey));
      setAddress(address);
      console.log('address hex: ',address);

      //get balance from server
      if (address) {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        setBalance(balance);
        console.log('balance: ',balance);
      } else {
        setBalance(0);
      }
    } catch (e) {
      alert(e.response.data.message);
    }
  }
  
  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <h5>Enter the Private Key for your account to approve the transfer</h5>

      <label>
        Private Key: (to sign the transaction)
        <input placeholder="Enter the Private Key" value={privateKey} onChange={onChange}></input>
      </label>

      <div className='publicKey'>Public Key of your account: {(address.slice(0, 5)) + "....." + address.slice(-5)}</div>
           
      <div className="balance">Balance: {balance}</div>
           
    </div>
  );
}

export default Wallet;