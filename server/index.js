const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const {secp256k1} = require("ethereum-cryptography/secp256k1");


app.use(cors());
app.use(express.json());
let isVerified = false;
const balances = {
  // privateKey=a3a5ff0411a41229d479d0e5acf72c9e2caab560a880e73f568b00240b7b13f5
  "03bc2ad9f5b91ad490b12f7b83fadca98e96ca973edbb17860e2e8c941b3e198d1": 100, //publicKey: balance  
  // privateKey=5e5fff14a9be04f804ba21cb43d5b2ac174293d26a81354b1d9ea1994660deea  
  "03fcdc6efcc6cf1a1d53911300a9b018732798527838abbb26e23df797069ffb23": 50,
  // privateKey=72a81d00b9ff980fede0d54b6636aae94fe71b1c8ef107886c6ae2a79e9df46d  
  "03b1e0c02fafd4e51406c247ce268a5c4cb96badc908e3639b0b22ff08823fc34c": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  
  res.send({ balance });
});

app.post("/send", (req, res) => {

  // get a signature from the client-side app
  const { sender, recipient, amount, signature, sendMessageHashed } = req.body;
  console.log('sender: ', sender);
  console.log(' recipient: ',recipient);
  console.log(' amount: ',amount);
  console.log(' signature: ',signature);
  console.log(' sendMessageHashed: ',sendMessageHashed);
  // signature string back to original form
  let restoredSignature = JSON.parse(signature);
  restoredSignature.r = BigInt(restoredSignature.r);
  restoredSignature.s = BigInt(restoredSignature.s);

  console.log('signature restored:', restoredSignature );
  
  // verify transaction
  isVerified = secp256k1.verify(restoredSignature, sendMessageHashed, sender);
  
  console.log('isVerified : ', isVerified);
  
  // if invalid 
  if (!isVerified) {
    res
      .status(400)
      .send({ message: "Unauthorized Transaction" });
    return;
  }    
    
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender], isVerified });
    }   
      
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
