const express = require("express");
const app = express();
const cors = require('cors');
const util = require('ethereumjs-util');
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/token", (req, res) => {
  let nonce = Math.floor(Math.random() * 1000000).toString(); // in a real life scenario we would random this after each login and fetch it from the db as well
  return res.send(nonce);
});
app.post("/auth", (req, res) => {
  console.log(req.body);
  let { address, signature, nonce } = req.body;

  // TODO: Validate signature by using eth tools (tip: ethereumjs-util and eth-sig-util)
  nonce = Buffer.from("\x19Ethereum Signed Message:\n" + nonce.length + nonce);
  nonce = util.keccak(nonce);
  const {v, r, s} = util.fromRpcSig(signature);
  const pubKey = util.ecrecover(util.toBuffer(nonce), v, r, s);
  const addrBuf = util.pubToAddress(pubKey);
  const recoveredAddress = util.bufferToHex(addrBuf);

  if (util.toChecksumAddress(recoveredAddress) !== util.toChecksumAddress(address)) {
    return res.status(401).send();
  }

  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
