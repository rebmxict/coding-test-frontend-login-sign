
import React, { useState } from 'react';
import './App.css';
import Web3 from 'web3';
import axios from 'axios';
import { API_SERVER } from './config';

function App() {
  const loginMetamask = async () => {
    if (window.ethereum) {
      await window.ethereum.send('eth_requestAccounts');
      window.web3 = new Web3(window.ethereum);
      const address = (await window.web3.eth.getAccounts())[0];
      const token = (await axios.get(`${API_SERVER}/token`)).data.toString();
      const signature = await window.web3.eth.personal.sign(token.toString(), address);
      axios.post(
        `${API_SERVER}/auth`,
        { address, signature, nonce: token }
      ).then((res) => {
        alert(res.data);
      }).catch((err) => {
        alert('Authorized!');
      });
    } else {
      alert('Please install metamask!');
    }
  }

  return (
    <div className="login-container">
      <button
        type="button"
        onClick={loginMetamask}
        style={{padding: 10, fontSize: 20}}
      >
        Login with MetaMask
      </button>
    </div>
  )
}

export default App
