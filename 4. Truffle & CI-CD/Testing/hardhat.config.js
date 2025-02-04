require("@nomicfoundation/hardhat-toolbox");

//require("@nomicfoundation/hardhat-chai-matchers")
//require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter");
require("solidity-coverage")

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = "KEY";

// Replace this private key with your Goerli account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const GOERLI_PRIVATE_KEY = "YOUR GOERLI PRIVATE KEY";


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  gasReporter: {
    enabled: true
  },
  /*networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY]
    }
  }*/
};
