import { useState } from "react";
import server from "./server";
import { hashMessage, signMessage } from "./scripts/crypto";
import { toHex } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance, privateKey, isVerified, setIsVerified}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  
  
  const setValue = (setter) => (evt) => setter(evt.target.value);

  const message = 'Alchemy University is Awsome!';
  
  async function transfer(evt) {
    evt.preventDefault();

    try {
      console.log('sendAmount: ', sendAmount);
      console.log('address: ', address);
      console.log('recipient: ', recipient);
      //hash message
      const sendMessageHashed = toHex(hashMessage(message));
      console.log('sendMessageHashed: ', sendMessageHashed);
      //sign the transaction
      let signature = signMessage(sendMessageHashed, privateKey);
      console.log('signature: ', signature);
      //change signature to JSON format
      signature = JSON.stringify({
        ...signature,
        r: signature.r.toString(),
        s: signature.s.toString(),
      });
      console.log('signature json string: ', signature);
      //send signature, sender address, amount to transfer to the server
      const {
        data: { balance, isVerified },
      } = await server.post(`send`, {
        sender: address,        
        recipient,
        amount: parseInt(sendAmount),
        signature: signature,
        sendMessageHashed: sendMessageHashed,
        message: message,
      });
      setBalance(balance);
      setIsVerified(isVerified);
      console.log('isVerified: ', isVerified);
    } catch (e) {
      isVerified = false;
      setIsVerified(isVerified);
      alert(e.response.data.message);
    }
  }  

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient Public Key
        <input
          placeholder="Enter the Destination Public Key"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <div>Private Key to sign transaction: {privateKey.slice(0, 5) + "....." + privateKey.slice(-5)}</div>
      
      <input type="submit" className="button" value="Approve Transfer" />

      <h2 className="isVerified" >Transaction status: {isVerified ? "Successful" : "Not Authorized"}</h2>
    </form>
  );
}

export default Transfer;
